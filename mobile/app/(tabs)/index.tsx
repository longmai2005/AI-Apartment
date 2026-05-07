import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Image, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../../constants/theme";
import { LISTINGS } from "../../constants/listings";
import { toggleSave, useSaved } from "../../constants/savedStore";

const { width } = Dimensions.get("window");
const FEATURED_W = width * 0.58;
const FILTERS = ["Tất cả", "Studio", "1 Phòng ngủ", "2 Phòng ngủ", "Penthouse"];

const FEATURED = LISTINGS.filter(l => l.verified && l.rating >= 4.7);

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const savedIds = useSaved();

  const filtered = LISTINGS.filter(l =>
    (filter === "Tất cả" || l.type === filter) &&
    (search === "" || l.title.toLowerCase().includes(search.toLowerCase()) || l.district.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Xin chào 👋</Text>
            <Text style={s.title}>Tìm nhà thuê</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable onPress={() => router.push("/notifications" as any)} style={s.iconBtn}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/(auth)/tenant-login")} style={s.iconBtn}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </Pressable>
          </View>
        </View>

        {/* AI Banner */}
        <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.aiBanner}>
          <View style={s.aiBannerLeft}>
            <View style={s.aiBannerIcon}><Text style={{ fontSize: 22 }}>🤖</Text></View>
            <View>
              <Text style={s.aiBannerTitle}>Super Broker AI</Text>
              <Text style={s.aiBannerSub}>Tư vấn 24/7 · Phản hồi trong 1.2s</Text>
            </View>
          </View>
          <View style={s.aiBannerBadge}><Text style={s.aiBannerBadgeText}>Hỏi ngay →</Text></View>
        </Pressable>

        {/* Search */}
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Quận, phường, tiêu đề..."
            placeholderTextColor={Colors.textDim}
            value={search}
            onChangeText={setSearch}
          />
          {search !== "" && (
            <Pressable onPress={() => setSearch("")}><Text style={{ color: Colors.textMuted, fontSize: 16 }}>✕</Text></Pressable>
          )}
        </View>

        {/* Featured section */}
        {search === "" && filter === "Tất cả" && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>⭐ Nổi bật</Text>
              <Pressable><Text style={[s.sectionSub, { color: Colors.cyan }]}>Xem tất cả</Text></Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 14, paddingBottom: 4 }}>
              {FEATURED.map(l => (
                <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={[s.featCard, { width: FEATURED_W }]}>
                  <Image source={{ uri: l.image }} style={s.featImage} />
                  <View style={s.featVerified}>
                    <Text style={s.featVerifiedText}>✅ AI</Text>
                  </View>
                  <Pressable
                    onPress={(e) => { e.stopPropagation(); toggleSave(l.id); }}
                    style={s.heartBtn}
                  >
                    <Text style={{ fontSize: 16 }}>{savedIds.has(l.id) ? "❤️" : "🤍"}</Text>
                  </Pressable>
                  <View style={s.featBody}>
                    <Text style={s.featTitle} numberOfLines={1}>{l.title}</Text>
                    <Text style={s.featPrice}>{l.price}</Text>
                    <Text style={s.featMeta} numberOfLines={1}>📍 {l.district}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          {FILTERS.map(f => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[s.filterChip, filter === f && s.filterChipActive]}>
              <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Stats row */}
        <View style={s.statsRow}>
          {[
            { label: "Tin đăng", val: "1,240+", color: Colors.cyan },
            { label: "Đã xác minh", val: "820", color: Colors.emerald },
            { label: "Hoạt động", val: "340", color: Colors.violet },
          ].map(stat => (
            <View key={stat.label} style={s.statCard}>
              <Text style={[s.statVal, { color: stat.color }]}>{stat.val}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Section title */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Gần đây</Text>
          <Text style={s.sectionSub}>{filtered.length} tin</Text>
        </View>

        {/* Listing cards */}
        <View style={s.cardList}>
          {filtered.map(listing => (
            <Pressable key={listing.id} onPress={() => router.push(`/listing/${listing.id}`)} style={s.card}>
              <View style={{ position: "relative" }}>
                <Image source={{ uri: listing.image }} style={s.cardImage} />
                {listing.verified && (
                  <View style={s.verifiedBadge}>
                    <Text style={s.verifiedText}>✅ AI Verified</Text>
                  </View>
                )}
                <Pressable
                  onPress={(e) => { e.stopPropagation(); toggleSave(listing.id); }}
                  style={s.cardHeart}
                >
                  <Text style={{ fontSize: 18 }}>{savedIds.has(listing.id) ? "❤️" : "🤍"}</Text>
                </Pressable>
              </View>
              <View style={s.cardBody}>
                <View style={s.cardRow}>
                  <Text style={s.cardTitle} numberOfLines={1}>{listing.title}</Text>
                  <Text style={s.cardRating}>⭐ {listing.rating}</Text>
                </View>
                <Text style={s.cardPrice}>{listing.price}</Text>
                <Text style={s.cardMeta} numberOfLines={1}>📍 {listing.district} · {listing.area}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 6 }}>
                  {listing.tags.map(tag => (
                    <View key={tag} style={s.tag}>
                      <Text style={s.tagText}>{tag}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Colors.bg },
  header:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  greeting:          { color: Colors.textMuted, fontSize: Font.sm },
  title:             { color: Colors.white, fontSize: Font.xl, fontWeight: "800", letterSpacing: -0.5 },
  headerRight:       { flexDirection: "row", gap: 10 },
  iconBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  aiBanner:          { marginHorizontal: 24, marginBottom: 18, padding: 16, borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(34,211,238,0.25)", backgroundColor: "rgba(34,211,238,0.06)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  aiBannerLeft:      { flexDirection: "row", alignItems: "center", gap: 12 },
  aiBannerIcon:      { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(34,211,238,0.1)", borderWidth: 1, borderColor: "rgba(34,211,238,0.3)", alignItems: "center", justifyContent: "center" },
  aiBannerTitle:     { color: Colors.white, fontWeight: "700", fontSize: Font.base },
  aiBannerSub:       { color: Colors.textMuted, fontSize: Font.xs },
  aiBannerBadge:     { backgroundColor: Colors.cyan, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  aiBannerBadgeText: { color: Colors.bg, fontWeight: "700", fontSize: Font.xs },
  searchBox:         { marginHorizontal: 24, marginBottom: 20, flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 12 },
  searchIcon:        { fontSize: 16, marginRight: 10 },
  searchInput:       { flex: 1, color: Colors.text, fontSize: Font.base },
  sectionHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 14 },
  sectionTitle:      { color: Colors.white, fontSize: Font.md, fontWeight: "700" },
  sectionSub:        { fontSize: Font.sm, color: Colors.textMuted },
  featCard:          { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", marginBottom: 4 },
  featImage:         { width: "100%", height: 140 },
  featVerified:      { position: "absolute", top: 8, left: 8, backgroundColor: "rgba(3,11,20,0.82)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  featVerifiedText:  { color: Colors.emerald, fontSize: 10, fontWeight: "700" },
  heartBtn:          { position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(3,11,20,0.7)", alignItems: "center", justifyContent: "center" },
  featBody:          { padding: 12 },
  featTitle:         { color: Colors.white, fontWeight: "700", fontSize: Font.sm, marginBottom: 3 },
  featPrice:         { color: Colors.cyan, fontWeight: "800", fontSize: Font.base, marginBottom: 3 },
  featMeta:          { color: Colors.textMuted, fontSize: Font.xs },
  filterScroll:      { marginBottom: 20 },
  filterChip:        { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  filterChipActive:  { backgroundColor: "rgba(34,211,238,0.15)", borderColor: Colors.cyan },
  filterChipText:    { color: Colors.textMuted, fontSize: Font.sm, fontWeight: "600" },
  filterChipTextActive: { color: Colors.cyan },
  statsRow:          { flexDirection: "row", marginHorizontal: 24, gap: 10, marginBottom: 24 },
  statCard:          { flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 12, alignItems: "center" },
  statVal:           { fontSize: Font.md, fontWeight: "800" },
  statLabel:         { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  cardList:          { paddingHorizontal: 24, gap: 16 },
  card:              { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardImage:         { width: "100%", height: 200 },
  verifiedBadge:     { position: "absolute", top: 12, left: 12, backgroundColor: "rgba(3,11,20,0.85)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  verifiedText:      { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  cardHeart:         { position: "absolute", top: 10, right: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(3,11,20,0.7)", alignItems: "center", justifyContent: "center" },
  cardBody:          { padding: 16 },
  cardRow:           { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  cardTitle:         { flex: 1, color: Colors.white, fontWeight: "700", fontSize: Font.base, marginRight: 8 },
  cardRating:        { color: Colors.textMuted, fontSize: Font.sm },
  cardPrice:         { color: Colors.cyan, fontWeight: "800", fontSize: Font.md, marginBottom: 4 },
  cardMeta:          { color: Colors.textMuted, fontSize: Font.sm },
  tag:               { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: Colors.border },
  tagText:           { color: Colors.textMuted, fontSize: 11, fontWeight: "600" },
});
