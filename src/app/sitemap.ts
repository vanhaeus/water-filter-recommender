export default function sitemap() {
    const baseUrl = 'http://localhost:3000'; // Replace with actual domain in production

    const popularZips = ['98683', '90210', '10001', '60601', '33101', '98101'];

    const reports = popularZips.map((zip) => ({
        url: `${baseUrl}/report/${zip}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...reports,
    ];
}
