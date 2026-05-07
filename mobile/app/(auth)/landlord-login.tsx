import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../../constants/theme";

export default function LandlordLoginScreen() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); router.replace("/(tabs)"); }, 1200);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backText}>← Quay lại</Text>
          </Pressable>

          <View style={s.header}>
            <View style={s.iconBox}><Text style={{ fontSize: 32 }}>🏢</Text></View>
            <Text style={s.title}>Chủ nhà đăng nhập</Text>
            <Text style={s.sub}>Quản lý toà nhà với 4 AI Agents</Text>
          </View>

          {/* Features */}
          <View style={s.featureList}>
            {["Listing Verifier AI tự động", "Dashboard doanh thu real-time", "Smart Concierge 24/7", "Hợp đồng & VietQR tự động"].map(f => (
              <View key={f} style={s.featureRow}>
                <Text style={s.featureDot}>✦</Text>
                <Text style={s.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={s.form}>
            <Text style={s.label}>Email</Text>
            <TextInput style={s.input} placeholder="landlord@email.com" placeholderTextColor={Colors.textDim} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={s.label}>Mật khẩu</Text>
            <TextInput style={s.input} placeholder="••••••••" placeholderTextColor={Colors.textDim} value={password} onChangeText={setPassword} secureTextEntry />
          </View>

          <Pressable style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            <Text style={s.submitText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
          </Pressable>

          <View style={s.registerRow}>
            <Text style={s.registerText}>Chưa có tài khoản? </Text>
            <Pressable onPress={() => router.push("/(auth)/landlord-register")}>
              <Text style={[s.registerText, { color: Colors.violet }]}>Đăng ký miễn phí</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.replace("/(auth)/tenant-login")} style={s.switchRole}>
            <Text style={s.switchText}>Bạn là cư dân? Đăng nhập với vai trò Cư dân →</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  scroll:      { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn:     { paddingVertical: 16 },
  backText:    { color: Colors.textMuted, fontSize: Font.sm },
  header:      { alignItems: "center", paddingVertical: 28 },
  iconBox:     { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(167,139,250,0.1)", borderWidth: 1.5, borderColor: "rgba(167,139,250,0.3)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title:       { color: Colors.white, fontWeight: "800", fontSize: Font.xl, letterSpacing: -0.5 },
  sub:         { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6, textAlign: "center" },
  featureList: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 10, marginBottom: 24 },
  featureRow:  { flexDirection: "row", alignItems: "center", gap: 10 },
  featureDot:  { color: Colors.violet, fontSize: 12 },
  featureText: { color: Colors.textMuted, fontSize: Font.sm },
  form:        { gap: 8, marginBottom: 20 },
  label:       { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "700", letterSpacing: 0.4, marginTop: 4 },
  input:       { backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  submitBtn:   { backgroundColor: Colors.violet, paddingVertical: 17, borderRadius: Radius.full, alignItems: "center", marginBottom: 16 },
  submitText:  { color: "#fff", fontWeight: "800", fontSize: Font.base },
  registerRow: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  registerText: { color: Colors.textMuted, fontSize: Font.sm },
  switchRole:  { alignItems: "center", paddingVertical: 12 },
  switchText:  { color: Colors.textDim, fontSize: Font.xs, textAlign: "center" },
});
