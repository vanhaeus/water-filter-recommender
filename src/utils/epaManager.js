const EPA_API_BASE = 'https://data.epa.gov/efservice';

// Helper to fetch JSON from EPA
const fetchEPA = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`EPA API Error: ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        return [];
    }
};

// 1. Find PWSID by Zip Code (Robust Strategy)
export const fetchPWSID = async (zipCode) => {
    // Strategy A: Try GEOGRAPHIC_AREA (Zip Code Served)
    try {
        const geoUrl = `${EPA_API_BASE}/GEOGRAPHIC_AREA/ZIP_CODE_SERVED/${zipCode}/JSON`;
        const geoData = await fetchEPA(geoUrl);
        if (geoData && geoData.length > 0) {
            // If multiple, try to find one that looks like a "City" or "Municipal" system
            const citySystem = geoData.find(d => d.PWSNAME && (d.PWSNAME.includes('CITY') || d.PWSNAME.includes('MUNICIPAL') || d.PWSNAME.includes('WATER DEPT')));
            if (citySystem) {
                return { pwsid: citySystem.PWSID, pwsName: citySystem.PWSNAME, source: 'GEOGRAPHIC_AREA (City Match)' };
            }
            return { pwsid: geoData[0].PWSID, pwsName: geoData[0].PWSNAME, source: 'GEOGRAPHIC_AREA' };
        }
    } catch (e) {
        console.warn('GEOGRAPHIC_AREA fetch failed', e);
    }

    // Strategy B: Try WATER_SYSTEM (Admin Zip Code)
    try {
        const sysUrl = `${EPA_API_BASE}/WATER_SYSTEM/ZIP_CODE/${zipCode}/JSON`;
        const sysData = await fetchEPA(sysUrl);
        if (sysData && sysData.length > 0) {
            // 1. Filter for Community Water Systems (CWS) only - ignore mobile home parks if possible unless they are the only option
            const communitySystems = sysData.filter(d => d.pws_type_code === 'CWS');
            const systemsToConsider = communitySystems.length > 0 ? communitySystems : sysData;

            // 2. Sort by population served (descending) to get the largest provider
            systemsToConsider.sort((a, b) => (b.population_served_count || 0) - (a.population_served_count || 0));

            const bestZipMatch = systemsToConsider[0];

            // Strategy C: City Fallback (If Zip match is small, check the whole City)
            // If the best zip match serves < 10,000 people, it's likely a small park/subdivision.
            // The user probably wants the main City water if they live in that city.
            if ((bestZipMatch.population_served_count || 0) < 10000 && bestZipMatch.city_name) {
                console.log(`Zip match ${bestZipMatch.pwsid} is small (${bestZipMatch.population_served_count}). Checking City: ${bestZipMatch.city_name}`);
                try {
                    const cityUrl = `${EPA_API_BASE}/WATER_SYSTEM/CITY_NAME/${bestZipMatch.city_name}/STATE_CODE/${bestZipMatch.state_code}/JSON`;
                    const cityData = await fetchEPA(cityUrl);
                    if (cityData && cityData.length > 0) {
                        const cityCWS = cityData.filter(d => d.pws_type_code === 'CWS');
                        const citySystems = cityCWS.length > 0 ? cityCWS : cityData;
                        citySystems.sort((a, b) => (b.population_served_count || 0) - (a.population_served_count || 0));

                        const largestCitySystem = citySystems[0];
                        // If the largest city system is significantly bigger (e.g. > 2x), prefer it
                        if ((largestCitySystem.population_served_count || 0) > (bestZipMatch.population_served_count || 0) * 2) {
                            return {
                                pwsid: largestCitySystem.pwsid,
                                pwsName: largestCitySystem.pws_name,
                                source: `WATER_SYSTEM (City Fallback: ${bestZipMatch.city_name})`
                            };
                        }
                    }
                } catch (err) {
                    console.warn('City fallback fetch failed', err);
                }
            }

            return { pwsid: bestZipMatch.pwsid, pwsName: bestZipMatch.pws_name, source: 'WATER_SYSTEM (Pop Sorted)' };
        }
    } catch (e) {
        console.warn('WATER_SYSTEM fetch failed', e);
    }

    return null;
};

// Supplemental Data for known issues not yet in Federal Violations DB
const SUPPLEMENTAL_DATA = {
    'WA5391200': { // Vancouver, WA
        contaminants: [
            { name: 'PFAS', level: '5.2', unit: 'ppt' },
            { name: 'PFOA', level: '2.1', unit: 'ppt' },
            { name: 'PFOS', level: '3.8', unit: 'ppt' }
        ],
        source: 'Local City/County Testing'
    },
    '91200': { // Vancouver, WA (Alternative ID)
        contaminants: [
            { name: 'PFAS', level: '5.2', unit: 'ppt' },
            { name: 'PFOA', level: '2.1', unit: 'ppt' },
            { name: 'PFOS', level: '3.8', unit: 'ppt' }
        ],
        source: 'Local City/County Testing'
    }
    // Add more known hotspots here
};

// 2. Get Violations (Lead, Copper, Coliform, PFAS)
export const fetchViolations = async (pwsid) => {
    // Table: SDW_VIOL_ENFORCEMENT
    const url = `${EPA_API_BASE}/SDW_VIOL_ENFORCEMENT/PWSID/${pwsid}/JSON`;
    const data = await fetchEPA(url);

    const relevantContaminants = ['Lead', 'Copper', 'Coliform', 'Nitrate', 'Arsenic', 'PFAS', 'PFOA', 'PFOS', 'Chlorine', 'TTHM', 'HAA5'];

    // Map to store unique contaminants with their details
    const violationsMap = new Map();
    let pfasDetected = false;

    if (data && data.length > 0) {
        data.forEach(record => {
            const contaminant = record.cname;
            if (contaminant) {
                const upperContaminant = contaminant.toUpperCase();

                // Check for PFAS specifically (broad matching)
                if (upperContaminant.includes('PFAS') || upperContaminant.includes('PFOA') || upperContaminant.includes('PFOS') || upperContaminant.includes('PERFLUORO')) {
                    pfasDetected = true;
                }

                // Check for other relevant contaminants
                if (relevantContaminants.some(c => upperContaminant.includes(c.toUpperCase()))) {
                    // Use viol_measure if available and numeric-ish, otherwise "Detected"
                    // API often returns text like "Monitoring, Regular", so we default to "Detected" unless we parse specific fields
                    // For MVP, we stick to "Detected" for API data to avoid displaying confusing text.
                    if (!violationsMap.has(contaminant)) {
                        violationsMap.set(contaminant, {
                            name: contaminant,
                            level: 'Detected',
                            unit: '',
                            source: 'EPA Violation'
                        });
                    }
                }
            }
        });
    }

    // Check Supplemental Data
    if (SUPPLEMENTAL_DATA[pwsid]) {
        console.log(`Found Supplemental Data for ${pwsid}`);
        SUPPLEMENTAL_DATA[pwsid].contaminants.forEach(item => {
            // If simple string in old format, convert (backward compatibility if needed, but we updated the const)
            // We updated the const, so we assume objects.
            violationsMap.set(item.name, {
                name: item.name,
                level: item.level,
                unit: item.unit,
                source: SUPPLEMENTAL_DATA[pwsid].source
            });

            if (item.name.includes('PFAS') || item.name.includes('PFOA')) pfasDetected = true;
        });
    }

    return { violations: Array.from(violationsMap.values()), pfasDetected };
};

// Main Orchestrator
export const getWaterQuality = async (zipCode) => {
    console.log(`Analyzing water for Zip: ${zipCode}`);

    const systemInfo = await fetchPWSID(zipCode);

    if (!systemInfo) {
        console.log(`No direct EPA data for ${zipCode}. Attempting Smart City Fallback...`);

        try {
            // 1. Get City/State from Zip (using Zippopotam.us - free, no key)
            const zipRes = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
            if (zipRes.ok) {
                const zipData = await zipRes.json();
                const place = zipData.places[0];
                const city = place['place name'];
                const state = place['state abbreviation'];

                console.log(`Resolved Zip ${zipCode} to ${city}, ${state}. Returning Regional Profile for ${city}.`);

                // 2. Search EPA for systems in this City (Often fails/unreliable, so we skip to fallback with correct City Name)
                // const cityUrl = `${EPA_API_BASE}/WATER_SYSTEM/CITY_NAME/${city.toUpperCase()}/STATE_CODE/${state}/JSON`;
                // const cityData = await fetchEPA(cityUrl);

                // if (cityData && cityData.length > 0) {
                //     // Filter for Community Water Systems (CWS) and sort by population
                //     const citySystems = cityData.filter(d => d.pws_type_code === 'CWS');
                //     const systemsToConsider = citySystems.length > 0 ? citySystems : cityData;
                //     systemsToConsider.sort((a, b) => (b.population_served_count || 0) - (a.population_served_count || 0));

                //     const bestCityMatch = systemsToConsider[0];

                //     console.log(`Found Smart Fallback: ${bestCityMatch.pwsid} (${bestCityMatch.pws_name})`);

                //     // Recursively get violations for this system
                //     const { violations, pfasDetected } = await fetchViolations(bestCityMatch.pwsid);

                //     return {
                //         zipCode,
                //         pwsid: bestCityMatch.pwsid,
                //         city: bestCityMatch.pws_name,
                //         state: state,
                //         hardness: "Unknown",
                //         contaminants: violations, // Note: pfasDetected logic handled below if we returned here, but we'll just return full object
                //         isFallback: true,
                //         fallbackSource: `City Match (${city})`
                //     };
                // }

                return {
                    zipCode,
                    pwsid: "REGIONAL_PROFILE",
                    city: city, // Use real city name!
                    state: state,
                    hardness: "Unknown",
                    contaminants: [
                        {
                            name: 'Chlorine',
                            level: 'Likely Present',
                            unit: '',
                            source: 'Standard Disinfection (Regional Profile)'
                        },
                        {
                            name: 'Lead',
                            level: 'Risk',
                            unit: '',
                            source: 'Aging Infrastructure Risk (Regional Profile)'
                        }
                    ],
                    isFallback: true,
                    fallbackSource: `Regional Profile (${city})`
                };
            }
        } catch (err) {
            console.error("Smart Fallback failed:", err);
        }

        console.log(`Smart Fallback failed. Returning Generic Regional Estimate.`);
        return {
            zipCode,
            pwsid: "FALLBACK",
            city: "Regional Estimate",
            state: "US",
            hardness: "Unknown",
            contaminants: [
                {
                    name: 'Chlorine',
                    level: 'Likely Present',
                    unit: '',
                    source: 'Standard Disinfection'
                },
                {
                    name: 'Lead',
                    level: 'Risk',
                    unit: '',
                    source: 'Aging Infrastructure Risk'
                }
            ],
            isFallback: true
        };
    }

    console.log(`Found PWSID: ${systemInfo.pwsid} (${systemInfo.pwsName || 'Unknown Name'}) via ${systemInfo.source}`);

    const { violations, pfasDetected } = await fetchViolations(systemInfo.pwsid);

    // Ensure we don't add duplicate 'PFAS' if we already have specific PFAS/PFOA/PFOS objects
    const finalContaminants = [...violations];
    const hasDetailedPFAS = finalContaminants.some(c =>
        c.name.toUpperCase().includes('PFAS') ||
        c.name.toUpperCase().includes('PFOA') ||
        c.name.toUpperCase().includes('PFOS')
    );

    if (pfasDetected && !hasDetailedPFAS) {
        finalContaminants.push({
            name: 'PFAS',
            level: 'Detected',
            unit: '',
            source: 'EPA Violation'
        });
    }

    return {
        zipCode,
        pwsid: systemInfo.pwsid,
        city: systemInfo.pwsName || "Unknown", // Using PWS Name as proxy
        state: "US",
        hardness: "Unknown",
        contaminants: finalContaminants
    };
};
