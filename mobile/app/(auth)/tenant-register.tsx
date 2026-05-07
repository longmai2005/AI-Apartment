import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../../constants/theme";

export default function TenantRegisterScreen() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleRegister = () => {
    if (!name || !email || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); router.replace("/(tabs)"); }, 1400);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backText}>← Quay lại</Text>
          </Pressable>

          <View style={s.header}>
            <View style={s.iconBox}><Text style={{ fontSize: 32 }}>🏠</Text></View>
            <Text style={s.title}>Tạo tài khoản</Text>
            <Text style={s.sub}>Cư dân / Người thuê — Miễn phí hoàn toàn</Text>
          </View>

          <View style={s.form}>
            {[
              { label: "Họ và tên", value: name, set: setName, placeholder: "Nguyễn Văn A", type: "default" as const },
              { label: "Email",    value: email, set: setEmail, placeholder: "email@example.com", type: "email-address" as const },
              { label: "Số điện thoại", value: phone, set: setPhone, placeholder: "0912 345 678", type: "phone-pad" as const },
              { label: "Mật khẩu", value: password, set: setPassword, placeholder: "Ít nhất 8 ký tự", type: "default" as const, secure: true },
            ].map(({ label, value, set, placeholder, type, secure }) => (
              <View key={label}>
                <Text style={s.label}>{label}</Text>
                <TextInput
                  style={s.input}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.textDim}
                  value={value}
                  onChangeText={set}
                  keyboardType={type}
                  autoCapitalize="none"
                  secureTextEntry={secure}
                />
              </View>
            ))}
          </View>

          <Text style={s.terms}>
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Text style={{ color: Colors.cyan }}>Điều khoản dịch vụ</Text> và{" "}
            <Text style={{ color: Colors.cyan }}>Chính sách bảo mật</Text> của NestaVietAI.
          </Text>

          <Pressable style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
            <Text style={s.submitText}>{loading ? "Đang tạo tài khoản..." : "Đăng ký miễn phí →"}</Text>
          </Pressable>

          <View style={s.loginRow}>
            <Text style={s.loginText}>Đã có tài khoản? </Text>
            <Pressable onPress={() => router.replace("/(auth)/tenant-login")}>
              <Text style={[s.loginText, { color: Colors.cyan }]}>Đăng nhập</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.bg },
  scroll:     { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn:    { paddingVertical: 16 },
  backText:   { color: Colors.textMuted, fontSize: Font.sm },
  header:     { alignItems: "center", paddingVertical: 24 },
  iconBox:    { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(52,211,153,0.1)", borderWidth: 1.5, borderColor: "rgba(52,211,153,0.3)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title:      { color: Colors.white, fontWeight: "800", fontSize: Font.xxl, letterSpacing: -0.5 },
  sub:        { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6, textAlign: "center" },
  form:       { gap: 12, marginBottom: 18 },
  label:      { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "700", letterSpacing: 0.4, marginBottom: 6 },
  input:      { backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  terms:      { color: Colors.textDim, fontSize: Font.xs, textAlign: "center", lineHeight: 18, marginBottom: 20 },
  submitBtn:  { backgroundColor: Colors.emerald, paddingVertical: 17, borderRadius: Radius.full, alignItems: "center", marginBottom: 16 },
  submitText: { color: Colors.bg, fontWeight: "800", fontSize: Font.base },
  loginRow:   { flexDirection: "row", justifyContent: "center" },
  loginText:  { color: Colors.textMuted, fontSize: Font.sm },
});
