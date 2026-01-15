import Foundation
import Observation

@Observable
class HomeViewModel {
    var zipCode: String = ""
    var isLoading: Bool = false
    var errorMessage: String?
    var navigationPath: [String] = [] // For NavigationStack
    
    private let dataService: WaterDataService
    
    init(dataService: WaterDataService = .shared) {
        self.dataService = dataService
    }
    
    func analyzeWater() async {
        guard zipCode.count == 5, Int(zipCode) != nil else {
            errorMessage = "Please enter a valid 5-digit Zip Code"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            // Prefetch to validate (optional, or just navigate)
            let _ = try await dataService.fetchQuality(forZip: zipCode)
            isLoading = false
            HapticManager.shared.notification(type: .success)
            navigationPath.append(zipCode) // Trigger navigation
        } catch {
            isLoading = false
            HapticManager.shared.notification(type: .error)
            errorMessage = "Could not find data for this Zip Code."
        }
    }
}

@Observable
class ReportViewModel {
    var report: WaterQualityReport?
    var isLoading: Bool = true
    var errorMessage: String?
    
    private let zipCode: String
    private let dataService: WaterDataService
    
    init(zipCode: String, dataService: WaterDataService = .shared) {
        self.zipCode = zipCode
        self.dataService = dataService
    }
    
    func loadReport() async {
        isLoading = true
        do {
            self.report = try await dataService.fetchQuality(forZip: zipCode)
            isLoading = false
        } catch {
            isLoading = false
            errorMessage = "Failed to load report."
        }
    }
    
    // Helper for UI Color
    var gradeColorName: String {
        switch report?.grade {
        case "A": return "Green"
        case "B": return "Blue"
        case "C": return "Yellow"
        default: return "Red"
        }
    }
}
