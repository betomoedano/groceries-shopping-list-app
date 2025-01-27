import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: configuration)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, configuration: configuration)
            entries.append(entry)
        }

        return Timeline(entries: entries, policy: .atEnd)
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
}

struct widgetEntryView : View {
  @Environment(\.widgetFamily) var widgetFamily
  var entry: Provider.Entry
  
  let useMockData = false;
  
  var numberOfLists: String? {
    if useMockData {
      return "10"
    } else {
      let defaults = UserDefaults(suiteName: "group.lesson.com.betoatexpo.groceries-shopping-list")
      return defaults?.string(forKey: "widget_total_lists")
    }
  }
  
  struct RecentList: Codable {
    let listId: String
    let name: String
    let emoji: String
  }

  var recentLists: [RecentList]? {
    if useMockData {
      let allLists = [
          RecentList(listId: "b0ad1f8c-5b49-44f6-b44c-52b8c1adb3a2", name: "Home Improvement", emoji: "🔨"),
          RecentList(listId: "b28de207-4a6e-4ad6-bc54-80d7b4950233", name: "Holiday Gifts", emoji: "🎁"),
          RecentList(listId: "c189d516-8559-49dd-80cd-9d98adbc0724", name: "Camping Trip", emoji: "⛺️"),
          RecentList(listId: "dc15b0fc-939b-4413-ad43-fab803a1e3b6", name: "Office Supplies", emoji: "📎"),
          RecentList(listId: "e21042a5-4958-4a97-8a81-cfd3a1a72b87", name: "Household Items", emoji: "🏠"),
          RecentList(listId: "f1b15f8c-6d62-4f97-9eaa-36bca1abc2f7", name: "Groceries", emoji: "🛒"),
          RecentList(listId: "g25ae307-8f97-4acd-89e6-05fcb1a98434", name: "Workout Gear", emoji: "🏋️‍♂️"),
          RecentList(listId: "h36cf417-7a56-49dd-bc98-1ebca9bc72e5", name: "Tech Gadgets", emoji: "💻"),
          RecentList(listId: "i47df527-9b67-4f86-9cd3-2fc9c2bc73f6", name: "Pet Supplies", emoji: "🐾"),
          RecentList(listId: "j58ef637-0c78-4a87-8de4-3fdba3cd74f7", name: "Party Planning", emoji: "🎉")
      ]

      if widgetFamily == .systemSmall || widgetFamily == .systemMedium {
        return Array(allLists.prefix(3))
      }
      return allLists
    } else {
      let defaults = UserDefaults(suiteName: "group.lesson.com.betoatexpo.groceries-shopping-list")
      guard let data = defaults?.data(forKey: "widget_recent_lists"),
            let lists = try? JSONDecoder().decode([RecentList].self, from: data) else {
        return nil
      }
      if widgetFamily == .systemSmall || widgetFamily == .systemMedium {
        return Array(lists.prefix(3))
      }
      return lists
    }
  }
  
  
  var body: some View {
    ZStack {
      HStack {
        VStack(alignment: .leading, spacing: 6) {
          HStack {
            Image(systemName: "basket")
              .font(.headline)
              .foregroundStyle(
                LinearGradient(
                  gradient: Gradient(colors: [Color.yellow, Color.orange]),
                  startPoint: .top,
                  endPoint: .bottom
                )
              )
            Text("Shopping")
              .font(.headline)
          }
          
          if let numberOfLists = numberOfLists {
            Text("\(numberOfLists) lists")
              .font(.subheadline)
              .foregroundColor(.secondary)
          }
          
          if let recentLists = recentLists {
            VStack(alignment: .leading, spacing: 4) {
              ForEach(recentLists, id: \.listId) { list in
                HStack {
                  Text(list.emoji)
                  Text(list.name)
                    .font(.system(size: 14))
                }
              }
            }
          } else {
            VStack(spacing: 0) {
              Text("📝")
                .font(.largeTitle)
              Text(
                widgetFamily == .systemSmall ? "No lists yet!" :
                  widgetFamily == .systemMedium ? "You don't have any lists yet!" :
                  "You don't have any lists yet.\nCreate one to get started!"
              )
              .multilineTextAlignment(.center)
              .font(.subheadline)
              .foregroundColor(.secondary)
              .padding(.horizontal)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
          }
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      }
    
    if widgetFamily != .systemSmall {
      VStack {
        Spacer()
        HStack {
          Spacer()
          Text("Powered by Expo")
            .font(.system(size: 10))
            .fontWeight(.semibold)
            .foregroundColor(.secondary)
            .padding(.trailing, 4)
        }
      }
    }
  }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(date: .now, configuration: .smiley)
    SimpleEntry(date: .now, configuration: .starEyes)
}
