import Foundation

enum WaterDataError: Error {
    case invalidZipCode
    case noDataFound
    case networkError(Error)
}

actor WaterDataService {
    static let shared = WaterDataService()
    
    // Mock Data (Ported from mock_database.json)
    private let mockData: [String: WaterQualityReport] = [
        "98683": WaterQualityReport(
            zipCode: "98683",
            city: "Vancouver",
            state: "WA",
            hardness: "Soft",
            contaminants: [
                Contaminant(name: "PFAS", level: 5.2, unit: "ppt", safetyLimit: 4.0, description: "Per- and polyfluoroalkyl substances"),
                Contaminant(name: "PFOA", level: 2.1, unit: "ppt", safetyLimit: 0.004, description: "Perfluorooctanoic acid"),
                Contaminant(name: "PFOS", level: 3.8, unit: "ppt", safetyLimit: 0.02, description: "Perfluorooctanesulfonic acid")
            ],
            lastUpdated: Date()
        ),
        "90210": WaterQualityReport(
            zipCode: "90210",
            city: "Beverly Hills",
            state: "CA",
            hardness: "Hard",
            contaminants: [
                Contaminant(name: "Arsenic", level: 0.005, unit: "mg/L", safetyLimit: 0.010, description: "Heavy metal"),
                Contaminant(name: "Chlorine", level: 1.5, unit: "mg/L", safetyLimit: 4.0, description: "Disinfectant")
            ],
            lastUpdated: Date()
        )
    ]
    
    func fetchQuality(forZip zip: String) async throws -> WaterQualityReport {
        // Simulate network delay
        try await Task.sleep(nanoseconds: 1 * 1_000_000_000)
        
        // 1. Mock Data Fallback (Since we don't have a real Swift backend yet)
        if let report = mockData[zip] {
            return report
        }
        
        // 2. Real API Logic would go here
        // let url = URL(string: "https://api.epa.gov/...")!
        // let (data, _) = try await URLSession.shared.data(from: url)
        // ...
        
        throw WaterDataError.noDataFound
    }
}
