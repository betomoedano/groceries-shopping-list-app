import AppIntents
import SwiftUI
import WidgetKit

struct widgetControl: ControlWidget {
    static let kind: String = "com.developer.example.widget"

    var body: some ControlWidgetConfiguration {
        AppIntentControlConfiguration(
            kind: Self.kind,
            provider: Provider()
        ) { value in
          ControlWidgetButton(
            action: LaunchAppIntent(),
                label: {
                  Text("Start Shopping Timer")
                }
            ) { isRunning in
                Label(isRunning ? "On" : "Off", systemImage: "timer")
            }
        }
        .displayName("Timer")
        .description("A an example control that runs a timer.")
    }
}

extension widgetControl {
    struct Value {
        var isRunning: Bool
        var name: String
    }

    struct Provider: AppIntentControlValueProvider {
        func previewValue(configuration: TimerConfiguration) -> Value {
            widgetControl.Value(isRunning: false, name: configuration.timerName)
        }

        func currentValue(configuration: TimerConfiguration) async throws -> Value {
            let isRunning = true // Check if the timer is running
            return widgetControl.Value(isRunning: isRunning, name: configuration.timerName)
        }
    }
}

struct TimerConfiguration: ControlConfigurationIntent {
    static let title: LocalizedStringResource = "Timer Name Configuration"

    @Parameter(title: "Timer Name", default: "Timer")
    var timerName: String
}

struct StartTimerIntent: SetValueIntent {
    static let title: LocalizedStringResource = "Start a timer"

    @Parameter(title: "Timer Name")
    var name: String

    @Parameter(title: "Timer is running")
    var value: Bool

    init() {}

    init(_ name: String) {
        self.name = name
    }

    func perform() async throws -> some IntentResult {
        // Start the timer…
        return .result()
    }
}

struct LaunchAppIntent: OpenIntent {
  static var title: LocalizedStringResource = "Launch App"
  @Parameter(title: "Target")
  var target: LaunchAppEnum
}

enum LaunchAppEnum: String, AppEnum {
    case timer
    case history


    static var typeDisplayRepresentation = TypeDisplayRepresentation("Productivity Timer's app screens")
    static var caseDisplayRepresentations = [
        LaunchAppEnum.timer : DisplayRepresentation("Timer"),
        LaunchAppEnum.history : DisplayRepresentation("History")
    ]
}
