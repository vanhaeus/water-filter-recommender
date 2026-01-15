import Foundation

struct Contaminant: Identifiable, Codable, Hashable {
    var id: String { name }
    let name: String
    let level: Double?
    let unit: String?
    let safetyLimit: Double?
    let description: String?
    
    // Helper to format level for display
    var formattedLevel: String {
        guard let level = level, let unit = unit else { return "Detected" }
        return "\(level) \(unit)"
    }
}

struct WaterQualityReport: Identifiable, Codable {
    var id: String { zipCode }
    let zipCode: String
    let city: String
    let state: String
    let hardness: String
    let contaminants: [Contaminant]
    let lastUpdated: Date
    
    // Computed Grade Logic (Ported from Web)
    var grade: String {
        let count = contaminants.count
        if count == 0 { return "A" }
        if count == 1 { return "B" }
        if count == 2 { return "C" }
        return "D"
    }
}
