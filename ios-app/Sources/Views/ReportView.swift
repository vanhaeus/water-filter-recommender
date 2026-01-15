import SwiftUI

struct ReportView: View {
    let zipCode: String
    @State private var viewModel: ReportViewModel
    
    init(zipCode: String) {
        self.zipCode = zipCode
        _viewModel = State(initialValue: ReportViewModel(zipCode: zipCode))
    }
    
    var body: some View {
        ZStack {
            // Background
            LinearGradient(colors: [.blue.opacity(0.05), .teal.opacity(0.05)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()
            
            if viewModel.isLoading {
                ProgressView("Analyzing Water Quality...")
                    .tint(.blue)
            } else if let error = viewModel.errorMessage {
                VStack(spacing: 16) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.system(size: 50))
                        .foregroundColor(.red)
                    Text("Error Loading Report")
                        .font(.headline)
                    Text(error)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            } else if let report = viewModel.report {
                ScrollView {
                    VStack(spacing: 24) {
                        // 1. Water Quality Card
                        WaterQualityCard(
                            report: report,
                            gradeColor: Color(viewModel.gradeColorName) // Helper needed in VM or View
                        )
                        
                        // 2. Contaminant List
                        ContaminantList(contaminants: report.contaminants)
                        
                        // 3. Filter Recommendation
                        FilterRecommendationView(contaminants: report.contaminants)
                        
                        // 4. Disclaimer
                        Text("Data provided by EPA. Always verify with local authorities.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.top, 20)
                            .padding(.bottom, 40)
                    }
                    .padding()
                }
                .navigationTitle("Report")
                .navigationBarTitleDisplayMode(.inline)
            }
        }
        .task {
            await viewModel.loadReport()
        }
    }
}

// Extension to map String color names to SwiftUI Colors
extension Color {
    init(_ name: String) {
        switch name {
        case "Green": self = .green
        case "Blue": self = .blue
        case "Yellow": self = .yellow
        case "Red": self = .red
        default: self = .gray
        }
    }
}
