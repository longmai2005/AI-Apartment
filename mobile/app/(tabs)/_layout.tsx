import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

function TabIcon({ label, emoji, focused }: { label: string; emoji: string; focused: boolean }) {
  return (
    <View style={[s.tab, focused && s.tabActive]}>
      <Text style={s.emoji}>{emoji}</Text>
      {focused && <Text style={s.label}>{label}</Text>}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: s.bar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.cyan,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Trang chủ" emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Tìm kiếm" emoji="🔍" focused={focused} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="AI Chat" emoji="🤖" focused={focused} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Đã lưu" emoji="❤️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Tôi" emoji="👤" focused={focused} /> }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  bar: {
    backgroundColor: "rgba(5,10,24,0.97)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
    height: 72,
    paddingBottom: 10,
  },
  tab:       { alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  tabActive: { backgroundColor: "rgba(34,211,238,0.1)" },
  emoji:     { fontSize: 20 },
  label:     { color: Colors.cyan, fontSize: 12, fontWeight: "700" },
});
