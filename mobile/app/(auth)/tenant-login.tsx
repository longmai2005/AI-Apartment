import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../../constants/theme";

export default function TenantLoginScreen() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("Vui lòng nhập đầy đủ thông tin"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 1200);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backText}>← Quay lại</Text>
          </Pressable>

          {/* Header */}
          <View style={s.header}>
            <View style={s.iconBox}><Text style={{ fontSize: 32 }}>🏠</Text></View>
            <Text style={s.title}>Đăng nhập</Text>
            <Text style={s.sub}>Cư dân / Người thuê nhà</Text>
          </View>

          {/* Social login */}
          <View style={s.socialRow}>
            {["🌐 Google", "🍎 Apple"].map(label => (
              <Pressable key={label} style={s.socialBtn}>
                <Text style={s.socialText}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={s.orRow}>
            <View style={s.orLine} /><Text style={s.orText}>hoặc</Text><View style={s.orLine} />
          </View>

          {/* Form */}
          <View style={s.form}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={[s.input, error && !email && s.inputError]}
              placeholder="tenant@email.com"
              placeholderTextColor={Colors.textDim}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={s.label}>Mật khẩu</Text>
            <TextInput
              style={[s.input, error && !password && s.inputError]}
              placeholder="••••••••"
              placeholderTextColor={Colors.textDim}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error !== "" && <Text style={s.errorText}>{error}</Text>}

            <Pressable style={s.forgotBtn}>
              <Text style={s.forgotText}>Quên mật khẩu?</Text>
            </Pressable>
          </View>

          {/* Submit */}
          <Pressable style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            <Text style={s.submitText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
          </Pressable>

          {/* Register link */}
          <View style={s.registerRow}>
            <Text style={s.registerText}>Chưa có tài khoản? </Text>
            <Pressable onPress={() => router.push("/(auth)/tenant-register")}>
              <Text style={[s.registerText, { color: Colors.cyan }]}>Đăng ký miễn phí</Text>
            </Pressable>
          </View>

          {/* Landlord switch */}
          <Pressable onPress={() => router.replace("/(auth)/landlord-login")} style={s.switchRole}>
            <Text style={s.switchText}>Bạn là chủ nhà? Đăng nhập với vai trò Chủ nhà →</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bg },
  scroll:       { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn:      { paddingVertical: 16 },
  backText:     { color: Colors.textMuted, fontSize: Font.sm },
  header:       { alignItems: "center", paddingVertical: 28 },
  iconBox:      { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(52,211,153,0.1)", borderWidth: 1.5, borderColor: "rgba(52,211,153,0.3)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title:        { color: Colors.white, fontWeight: "800", fontSize: Font.xxl, letterSpacing: -0.5 },
  sub:          { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6 },
  socialRow:    { flexDirection: "row", gap: 12, marginBottom: 20 },
  socialBtn:    { flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingVertical: 14, alignItems: "center" },
  socialText:   { color: Colors.text, fontWeight: "600", fontSize: Font.sm },
  orRow:        { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  orLine:       { flex: 1, height: 1, backgroundColor: Colors.border },
  orText:       { color: Colors.textMuted, fontSize: Font.xs },
  form:         { gap: 8, marginBottom: 20 },
  label:        { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "700", letterSpacing: 0.4, marginTop: 4 },
  input:        { backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  inputError:   { borderColor: "#ef4444" },
  errorText:    { color: "#ef4444", fontSize: Font.xs, marginTop: 4 },
  forgotBtn:    { alignSelf: "flex-end", paddingVertical: 6 },
  forgotText:   { color: Colors.cyan, fontSize: Font.xs },
  submitBtn:    { backgroundColor: Colors.emerald, paddingVertical: 17, borderRadius: Radius.full, alignItems: "center", marginBottom: 16 },
  submitText:   { color: Colors.bg, fontWeight: "800", fontSize: Font.base },
  registerRow:  { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  registerText: { color: Colors.textMuted, fontSize: Font.sm },
  switchRole:   { alignItems: "center", paddingVertical: 12 },
  switchText:   { color: Colors.textDim, fontSize: Font.xs, textAlign: "center" },
});
