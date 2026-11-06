import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// =======================================
// WARNA MINDCARE
// =======================================
const C = {
  bg: "#FFF5F5",
  peach: "#F7D6D0",
  pink: "#E2B4BD",
  dark: "#4A4A4A",
  white: "#FFFFFF",
  muted: "#887A7D",
  line: "#F0DBE0",
  accent: "#A66E80",
};

const F = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semi: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

type Weight = keyof typeof F;
type IconName = React.ComponentProps<typeof Ionicons>["name"];
type Role = "pasien" | "psikiater";

type Page =
  | "pilih"
  | "login"
  | "register"
  | "p-home"
  | "p-ai"
  | "p-list"
  | "p-detail"
  | "p-payment"
  | "p-session"
  | "p-history"
  | "p-history-detail"
  | "p-profile"
  | "d-home"
  | "d-schedule"
  | "d-bookings"
  | "d-detail"
  | "d-chat"
  | "d-wallet"
  | "d-profile";

type Status =
  | "masuk"
  | "menunggu_bayar"
  | "terkonfirmasi"
  | "selesai"
  | "ditolak"
  | "dibatalkan";

type Booking = {
  id: number;
  pasien: string;
  dokterId: string;
  tanggal: string;
  waktu: string;
  metode: "Telepon" | "Video Call";
  keluhan: string;
  harga: number;
  status: Status;
};

type Chat = {
  from: "pasien" | "psikiater";
  text: string;
};

type Review = {
  rating: number;
  note: string;
};

const formatRp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

const bersih = (n: number) => n - Math.round(n * 0.1);

const doctorChoices = [
  {
    id: "rina",
    bidang: "Depresi & Kecemasan",
    rating: "4.9",
    harga: 300000,
  },
  {
    id: "budi",
    bidang: "Stres & Burnout",
    rating: "4.8",
    harga: 250000,
  },
  {
    id: "maya",
    bidang: "Anak & Remaja",
    rating: "4.9",
    harga: 280000,
  },
];

const dates = ["6 Nov 2026", "7 Nov 2026"];

const times = ["09.00 - 09.30", "10.00 - 10.30", "14.00 - 14.30"];

const statusText: Record<Status, string> = {
  masuk: "Menunggu Persetujuan",
  menunggu_bayar: "Menunggu Pembayaran",
  terkonfirmasi: "Terkonfirmasi",
  selesai: "Selesai",
  ditolak: "Ditolak",
  dibatalkan: "Dibatalkan",
};

// =======================================
// KOMPONEN UI
// Dibuat di luar HomeScreen agar input
// tidak kehilangan fokus saat mengetik.
// =======================================

function Txt({
  children,
  weight = "regular",
  style,
}: {
  children: React.ReactNode;
  weight?: Weight;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text style={[{ fontFamily: F[weight], color: C.dark }, style]}>
      {children}
    </Text>
  );
}

function I({
  name,
  size = 22,
  color = C.dark,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

function Button({
  text,
  onPress,
  outline = false,
  disabled = false,
}: {
  text: string;
  onPress: () => void;
  outline?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[S.btn, outline && S.btnOutline, disabled && { opacity: 0.4 }]}
    >
      <Txt weight="semi" style={S.btnText}>
        {text}
      </Txt>
    </Pressable>
  );
}

function Field({
  label,
  value,
  change,
  password = false,
  multiline = false,
  keyboardType = "default",
  placeholder,
}: {
  label: string;
  value: string;
  change: (text: string) => void;
  password?: boolean;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 14 }}>
      <Txt weight="medium" style={S.label}>
        {label}
      </Txt>

      <View style={[S.inputWrap, multiline && { alignItems: "flex-start" }]}>
        <TextInput
          value={value}
          onChangeText={change}
          placeholder={placeholder || label}
          placeholderTextColor="#AB9BA0"
          keyboardType={keyboardType}
          autoCapitalize={
            keyboardType === "email-address" ? "none" : "sentences"
          }
          autoCorrect={false}
          secureTextEntry={password && !show}
          multiline={multiline}
          style={[
            S.input,
            multiline && {
              height: 100,
              textAlignVertical: "top",
            },
          ]}
        />

        {password && (
          <Pressable onPress={() => setShow(!show)} hitSlop={12}>
            <I
              name={show ? "eye-off-outline" : "eye-outline"}
              color={C.muted}
              size={20}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={S.card}>{children}</View>;
}

function Header({ title, back }: { title: string; back?: () => void }) {
  return (
    <View style={S.header}>
      {back && (
        <Pressable onPress={back} style={{ marginRight: 13 }}>
          <I name="arrow-back-outline" />
        </Pressable>
      )}

      <Txt weight="semi" style={{ fontSize: 16, flex: 1 }}>
        {title}
      </Txt>
    </View>
  );
}

function Pill({
  label,
  active,
  press,
}: {
  label: string;
  active: boolean;
  press: () => void;
}) {
  return (
    <Pressable onPress={press} style={[S.pill, active && S.pillActive]}>
      <Txt
        weight="medium"
        style={{
          fontSize: 11,
          color: active ? C.white : C.dark,
        }}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

function StatusTag({ status }: { status: Status }) {
  return (
    <View style={S.tag}>
      <Txt weight="medium" style={{ fontSize: 10 }}>
        {statusText[status]}
      </Txt>
    </View>
  );
}

function Avatar({ icon = "person-outline" }: { icon?: IconName }) {
  return (
    <View style={S.avatar}>
      <I name={icon} size={25} color={C.accent} />
    </View>
  );
}

// =======================================
// NAVIGASI BAWAH
// =======================================

function BottomBar({
  role,
  page,
  go,
}: {
  role: Role;
  page: Page;
  go: (page: Page) => void;
}) {
  const menus: {
    page: Page;
    label: string;
    icon: IconName;
  }[] =
    role === "pasien"
      ? [
          {
            page: "p-home",
            label: "Beranda",
            icon: "home-outline",
          },
          {
            page: "p-ai",
            label: "AI",
            icon: "chatbubble-ellipses-outline",
          },
          {
            page: "p-list",
            label: "Psikiater",
            icon: "medkit-outline",
          },
          {
            page: "p-history",
            label: "Riwayat",
            icon: "calendar-outline",
          },
          {
            page: "p-profile",
            label: "Profil",
            icon: "person-outline",
          },
        ]
      : [
          {
            page: "d-home",
            label: "Beranda",
            icon: "home-outline",
          },
          {
            page: "d-schedule",
            label: "Jadwal",
            icon: "calendar-outline",
          },
          {
            page: "d-bookings",
            label: "Booking",
            icon: "people-outline",
          },
          {
            page: "d-wallet",
            label: "Saldo",
            icon: "wallet-outline",
          },
          {
            page: "d-profile",
            label: "Profil",
            icon: "person-outline",
          },
        ];

  return (
    <View style={S.bottom}>
      {menus.map((m) => (
        <Pressable key={m.page} onPress={() => go(m.page)} style={S.bottomItem}>
          <I
            name={m.icon}
            size={21}
            color={page === m.page ? C.accent : C.muted}
          />

          <Txt
            weight={page === m.page ? "semi" : "regular"}
            style={{
              fontSize: 9,
              color: page === m.page ? C.accent : C.muted,
            }}
          >
            {m.label}
          </Txt>
        </Pressable>
      ))}
    </View>
  );
}

// =======================================
// CHATBOT AI DEMO
// =======================================

function aiDemoReply(question: string) {
  const q = question.toLowerCase();

  if (
    /bunuh diri|ingin mati|menyakiti diri|mengakhiri hidup|self.harm/.test(q)
  ) {
    return "Aku prihatin kamu sedang mengalami ini. Keselamatanmu sangat penting. Jika kamu dalam bahaya, segera hubungi layanan darurat setempat atau pergi ke IGD, dan beri tahu orang tepercaya yang bisa menemanimu sekarang. Aku bukan layanan darurat.";
  }

  if (/cemas|panik|takut|khawatir/.test(q)) {
    return "Terima kasih sudah cerita. Ketika cemas, kamu bisa mencoba menarik napas perlahan selama 4 hitungan lalu mengembuskannya selama 6 hitungan. Apa yang biasanya memicu rasa cemasmu? Kalau terus mengganggu, kamu bisa konsultasi dengan psikiater.";
  }

  if (/tidur|insomnia|begadang/.test(q)) {
    return "Sulit tidur memang melelahkan. Kamu bisa mencoba jadwal tidur teratur, mengurangi kafein sore hari, dan menjauhkan layar sebelum tidur. Sudah berapa lama kamu merasakannya?";
  }

  if (/stres|stress|capek|lelah|sedih/.test(q)) {
    return "Aku mendengarkanmu. Boleh ceritakan bagian yang paling berat? Kalau kamu nyaman, kita bisa coba membaginya menjadi satu masalah kecil yang bisa kamu tangani hari ini.";
  }

  if (/psikiater|konsultasi|dokter/.test(q)) {
    return "Kamu bisa membuka menu Psikiater, melihat profil dan jadwal, lalu mengajukan booking. Setelah disetujui, kamu menyelesaikan pembayaran simulasi dan mengikuti konsultasi.";
  }

  return "Terima kasih sudah bercerita. Aku bisa menemanimu mencari informasi umum dan langkah dukungan awal. Apa yang paling ingin kamu ceritakan atau tanyakan? Aku tidak dapat memberikan diagnosis atau resep.";
}

// =======================================
// APLIKASI UTAMA
// =======================================

export default function HomeScreen() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [role, setRole] = useState<Role | null>(null);

  const [page, setPage] = useState<Page>("pilih");

  const [notice, setNotice] = useState("");

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Pantau saat keyboard HP dibuka dan ditutup
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );

    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // DATA LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // DATA REGISTRASI
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [phone, setPhone] = useState("");

  // PROFIL
  const [patientName, setPatientName] = useState("Andi Pratama");

  const [doctorName, setDoctorName] = useState("dr. Rina Sari, Sp.KJ");

  const [specialty, setSpecialty] = useState("Psikiatri");

  const [fee, setFee] = useState("300000");

  // JADWAL PSIKIATER
  const [slots, setSlots] = useState([
    { time: times[0], active: true },
    { time: times[1], active: true },
    { time: times[2], active: true },
  ]);

  const [newSlot, setNewSlot] = useState("");

  // DATA BOOKING DEMO
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      pasien: "Siti Rahma",
      dokterId: "rina",
      tanggal: dates[0],
      waktu: times[1],
      metode: "Telepon",
      keluhan: "Stres dalam kegiatan sehari-hari.",
      harga: 300000,
      status: "masuk",
    },
    {
      id: 2,
      pasien: "Maya Putri",
      dokterId: "rina",
      tanggal: "2 Nov 2026",
      waktu: times[0],
      metode: "Video Call",
      keluhan: "Konsultasi lanjutan.",
      harga: 300000,
      status: "selesai",
    },
    {
      id: 3,
      pasien: "Andi Pratama",
      dokterId: "budi",
      tanggal: "3 Nov 2026",
      waktu: "14.00 - 14.30",
      metode: "Telepon",
      keluhan: "Ingin membicarakan kesulitan tidur dan stres.",
      harga: 250000,
      status: "selesai",
    },
    {
      id: 4,
      pasien: "Andi Pratama",
      dokterId: "rina",
      tanggal: "7 Nov 2026",
      waktu: "09.00 - 09.30",
      metode: "Video Call",
      keluhan: "Ingin melakukan konsultasi lanjutan.",
      harga: 300000,
      status: "masuk",
    },
  ]);

  const [selectedDoc, setSelectedDoc] = useState("rina");

  const [selectedBooking, setSelectedBooking] = useState(1);

  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState(times[0]);

  const [method, setMethod] = useState<"Telepon" | "Video Call">("Video Call");

  const [complaint, setComplaint] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("BCA");

  const [search, setSearch] = useState("");

  const [bookingFilter, setBookingFilter] = useState<"semua" | Status>("semua");

  const [withdrawals, setWithdrawals] = useState<number[]>([]);

  // CHAT KONSULTASI
  const [chatByBooking, setChatByBooking] = useState<Record<number, Chat[]>>(
    {},
  );

  const [sessionInput, setSessionInput] = useState("");

  // CHAT AI
  const [aiInput, setAiInput] = useState("");

  const [aiMessages, setAiMessages] = useState<
    { from: "ai" | "user"; text: string }[]
  >([
    {
      from: "ai",
      text: "Halo! Aku MindCare AI 🌷 Aku bisa mendengarkan ceritamu dan membantu dengan informasi kesehatan mental umum. Aku bukan pengganti psikiater dan tidak bisa memberikan diagnosis. Bagaimana perasaanmu hari ini?",
    },
  ]);

  // ULASAN RIWAYAT PASIEN
  const [reviews, setReviews] = useState<Record<number, Review>>({});

  const [ratingDraft, setRatingDraft] = useState(0);

  const [reviewDraft, setReviewDraft] = useState("");

  // =====================================
  // DATA TURUNAN
  // =====================================

  const doctorNameById = (id: string) =>
    id === "rina"
      ? doctorName
      : id === "budi"
        ? "dr. Budi Santoso, Sp.KJ"
        : "dr. Maya Lestari, Sp.KJ";

  const doctor =
    doctorChoices.find((d) => d.id === selectedDoc) || doctorChoices[0];

  const selected =
    bookings.find((b) => b.id === selectedBooking) || bookings[0];

  const myBookings = bookings.filter((b) => b.pasien === patientName);

  const doctorBookings = bookings.filter((b) => b.dokterId === "rina");

  const completed = doctorBookings.filter((b) => b.status === "selesai");

  const totalNet = completed.reduce((a, b) => a + bersih(b.harga), 0);

  const withdrawn = withdrawals.reduce((a, b) => a + b, 0);

  const balance = Math.max(0, totalNet - withdrawn);

  const mainPages: Page[] =
    role === "pasien"
      ? ["p-home", "p-ai", "p-list", "p-history", "p-profile"]
      : ["d-home", "d-schedule", "d-bookings", "d-wallet", "d-profile"];

  // =====================================
  // FUNGSI NAVIGASI
  // =====================================

  const change = (target: Page) => {
    Keyboard.dismiss();
    setNotice("");
    setPage(target);
  };

  const logout = () => {
    Keyboard.dismiss();
    setRole(null);
    setEmail("");
    setPassword("");
    setNotice("");
    setPage("pilih");
  };

  const setStatus = (id: number, status: Status) => {
    setBookings((old) => old.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  // Membuka halaman detail riwayat pasien
  const openHistoryDetail = (id: number) => {
    setSelectedBooking(id);

    setRatingDraft(reviews[id]?.rating || 0);

    setReviewDraft(reviews[id]?.note || "");

    change("p-history-detail");
  };

  // =====================================
  // CHAT KONSULTASI
  // =====================================

  const chatForSession = chatByBooking[selectedBooking] || [
    {
      from: "pasien" as const,
      text: "Selamat siang, Dok. Saya siap berkonsultasi.",
    },
    {
      from: "psikiater" as const,
      text: "Selamat siang. Apa yang ingin Anda ceritakan?",
    },
  ];

  const sendSession = () => {
    if (!sessionInput.trim() || !role) {
      return;
    }

    setChatByBooking((old) => ({
      ...old,
      [selectedBooking]: [
        ...(old[selectedBooking] || chatForSession),
        {
          from: role,
          text: sessionInput.trim(),
        },
      ],
    }));

    setSessionInput("");
  };

  const sendAI = () => {
    const question = aiInput.trim();

    if (!question) return;

    setAiMessages((old) => [
      ...old,
      {
        from: "user",
        text: question,
      },
      {
        from: "ai",
        text: aiDemoReply(question),
      },
    ]);

    setAiInput("");
  };

  const isTaken = (d: string, t: string, w: string) =>
    bookings.some(
      (b) =>
        b.dokterId === d &&
        b.tanggal === t &&
        b.waktu === w &&
        !["ditolak", "dibatalkan"].includes(b.status),
    );

  const available =
    selectedDoc !== "rina" || slots.some((s) => s.time === time && s.active);

  if (!loaded) {
    return (
      <View style={S.loading}>
        <ActivityIndicator color={C.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* KEYBOARD AWARE BAWAAN REACT NATIVE */}
      <KeyboardAvoidingView
        style={S.keyboardRoot}
        behavior={Platform.OS === "web" ? undefined : "padding"}
        keyboardVerticalOffset={0}
      >
        <View style={S.app}>
          {notice !== "" && (
            <Pressable style={S.notice} onPress={() => setNotice("")}>
              <Txt
                style={{
                  flex: 1,
                  fontSize: 11,
                }}
              >
                {notice}
              </Txt>

              <I name="close-outline" size={18} />
            </Pressable>
          )}

          {/* ============================== */}
          {/* PILIH ROLE */}
          {/* ============================== */}

          {page === "pilih" && (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={S.welcome}
            >
              <View style={S.logo}>
                <I name="heart-outline" size={52} color={C.accent} />
              </View>

              <Txt weight="bold" style={S.brand}>
                MindCare
              </Txt>

              <Txt
                style={[
                  S.muted,
                  {
                    textAlign: "center",
                    marginBottom: 32,
                  },
                ]}
              >
                Dukungan kesehatan mental, kapan saja dan di mana saja.
              </Txt>

              <Txt weight="semi" style={S.section}>
                Masuk sebagai siapa?
              </Txt>

              <Pressable
                style={S.roleCard}
                onPress={() => {
                  setRole("pasien");
                  change("login");
                }}
              >
                <Avatar icon="person-outline" />

                <View style={{ flex: 1 }}>
                  <Txt weight="semi">Pasien</Txt>

                  <Txt style={S.small}>
                    AI Assistant, konsultasi, dan riwayat
                  </Txt>
                </View>

                <I name="chevron-forward-outline" color={C.accent} />
              </Pressable>

              <Pressable
                style={S.roleCard}
                onPress={() => {
                  setRole("psikiater");
                  change("login");
                }}
              >
                <Avatar icon="medkit-outline" />

                <View style={{ flex: 1 }}>
                  <Txt weight="semi">Psikiater</Txt>

                  <Txt style={S.small}>
                    Jadwal, booking, konsultasi, dan saldo
                  </Txt>
                </View>

                <I name="chevron-forward-outline" color={C.accent} />
              </Pressable>

              <Txt
                style={[
                  S.small,
                  {
                    textAlign: "center",
                    marginTop: 25,
                  },
                ]}
              >
                Pemilihan role ini hanya untuk pengujian frontend.
              </Txt>
            </ScrollView>
          )}

          {/* ============================== */}
          {/* LOGIN */}
          {/* ============================== */}

          {page === "login" && (
            <>
              <Header title="Kembali ke Pilihan Role" back={logout} />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.welcome}
              >
                <View style={S.logo}>
                  <I name="heart-outline" size={49} color={C.accent} />
                </View>

                <Txt weight="bold" style={S.brand}>
                  MindCare
                </Txt>

                <Txt style={[S.muted, { marginBottom: 23 }]}>
                  Masuk sebagai {role === "pasien" ? "Pasien" : "Psikiater"}
                </Txt>

                <Card>
                  <Txt weight="semi" style={S.cardTitle}>
                    Selamat Datang Kembali!
                  </Txt>

                  <Txt style={[S.muted, { marginBottom: 20 }]}>
                    Silakan masuk ke akun demo MindCare.
                  </Txt>

                  <Field
                    label="Email"
                    value={email}
                    change={setEmail}
                    keyboardType="email-address"
                  />

                  <Field
                    label="Password"
                    value={password}
                    change={setPassword}
                    password
                  />

                  <Button
                    text="Masuk"
                    onPress={() => {
                      if (!email.trim() || !password.trim()) {
                        setNotice("Isi email dan password dulu ya.");
                        return;
                      }

                      change(role === "pasien" ? "p-home" : "d-home");
                    }}
                  />

                  <Pressable
                    onPress={() => change("register")}
                    style={{ marginTop: 17 }}
                  >
                    <Txt weight="medium" style={S.link}>
                      Belum punya akun? Daftar di sini
                    </Txt>
                  </Pressable>
                </Card>

                <Txt style={S.small}>
                  Login masih simulasi, belum terhubung Supabase.
                </Txt>
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* REGISTRASI */}
          {/* ============================== */}

          {page === "register" && (
            <>
              <Header
                title={
                  role === "pasien"
                    ? "Registrasi Pasien"
                    : "Registrasi Psikiater"
                }
                back={() => change("login")}
              />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.content}
              >
                <View style={S.softBox}>
                  <Txt style={S.muted}>
                    Daftar mandiri untuk mode demo. Akun psikiater belum
                    diverifikasi untuk praktik nyata.
                  </Txt>
                </View>

                <Card>
                  <Field
                    label="Nama Lengkap"
                    value={regName}
                    change={setRegName}
                  />

                  <Field
                    label="Email"
                    value={regEmail}
                    change={setRegEmail}
                    keyboardType="email-address"
                  />

                  <Field
                    label="Password"
                    value={regPassword}
                    change={setRegPassword}
                    password
                  />

                  {role === "psikiater" && (
                    <>
                      <Field
                        label="Nomor STR / SIP (Demo)"
                        value={credential}
                        change={setCredential}
                      />

                      <Field
                        label="Nomor Telepon"
                        value={phone}
                        change={setPhone}
                        keyboardType="phone-pad"
                      />
                    </>
                  )}

                  <Button
                    text="Daftar Sekarang"
                    onPress={() => {
                      if (
                        !regName.trim() ||
                        !regEmail.trim() ||
                        !regPassword.trim() ||
                        (role === "psikiater" &&
                          (!credential.trim() || !phone.trim()))
                      ) {
                        setNotice("Lengkapi data pendaftaran.");
                        return;
                      }

                      if (role === "pasien") {
                        setPatientName(regName.trim());
                      } else {
                        setDoctorName(regName.trim());
                      }

                      setEmail(regEmail);
                      setPassword(regPassword);

                      change(role === "pasien" ? "p-home" : "d-home");
                    }}
                  />
                </Card>
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - BERANDA */}
          {/* ============================== */}

          {page === "p-home" && (
            <>
              <Header title="MindCare • Pasien" />

              <ScrollView contentContainerStyle={S.content}>
                <View style={S.greeting}>
                  <View style={{ flex: 1 }}>
                    <Txt style={S.muted}>Halo, selamat datang 👋</Txt>

                    <Txt weight="bold" style={S.title}>
                      {patientName}!
                    </Txt>

                    <Txt style={S.muted}>Bagaimana perasaanmu hari ini?</Txt>
                  </View>

                  <Avatar />
                </View>

                <Pressable style={S.hero} onPress={() => change("p-ai")}>
                  <I
                    name="chatbubble-ellipses-outline"
                    size={36}
                    color={C.accent}
                  />

                  <Txt weight="semi" style={S.cardTitle}>
                    Butuh teman cerita?
                  </Txt>

                  <Txt style={S.muted}>
                    Ceritakan yang kamu rasakan kepada AI MindCare.
                  </Txt>

                  <Txt
                    weight="semi"
                    style={{
                      color: C.accent,
                      fontSize: 12,
                    }}
                  >
                    Mulai ngobrol →
                  </Txt>
                </Pressable>

                <Txt weight="semi" style={S.section}>
                  Menu Cepat
                </Txt>

                <View style={S.tiles}>
                  {[
                    {
                      title: "AI Assistant",
                      icon: "chatbubbles-outline" as IconName,
                      target: "p-ai" as Page,
                    },
                    {
                      title: "Cari Psikiater",
                      icon: "medkit-outline" as IconName,
                      target: "p-list" as Page,
                    },
                    {
                      title: "Riwayat",
                      icon: "calendar-outline" as IconName,
                      target: "p-history" as Page,
                    },
                    {
                      title: "Profil Saya",
                      icon: "person-outline" as IconName,
                      target: "p-profile" as Page,
                    },
                  ].map((x) => (
                    <Pressable
                      key={x.title}
                      style={S.tile}
                      onPress={() => change(x.target)}
                    >
                      <I name={x.icon} color={C.accent} size={29} />

                      <Txt
                        weight="medium"
                        style={{
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        {x.title}
                      </Txt>
                    </Pressable>
                  ))}
                </View>

                <Txt weight="semi" style={S.section}>
                  Konsultasi Saya
                </Txt>

                {myBookings.length === 0 ? (
                  <Card>
                    <Txt style={S.muted}>
                      Belum ada booking. Yuk, cari psikiater.
                    </Txt>
                  </Card>
                ) : (
                  myBookings
                    .slice()
                    .reverse()
                    .slice(0, 2)
                    .map((b) => (
                      <Pressable
                        key={b.id}
                        onPress={() => openHistoryDetail(b.id)}
                      >
                        <Card>
                          <Txt weight="semi">{doctorNameById(b.dokterId)}</Txt>

                          <Txt style={S.small}>
                            {b.tanggal} • {b.waktu}
                          </Txt>

                          <View
                            style={{
                              marginTop: 10,
                            }}
                          >
                            <StatusTag status={b.status} />
                          </View>

                          <Txt
                            style={{
                              fontSize: 11,
                              color: C.accent,
                              marginTop: 10,
                            }}
                          >
                            Lihat detail →
                          </Txt>
                        </Card>
                      </Pressable>
                    ))
                )}
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - AI */}
          {/* ============================== */}

          {page === "p-ai" && (
            <>
              <Header
                title="AI MindCare • Teman Cerita"
                back={() => change("p-home")}
              />

              <View style={S.softBox}>
                <Txt style={S.small}>
                  Chat ini respons simulasi, bukan AI online. Jangan masukkan
                  data sensitif. AI bukan dokter atau layanan darurat.
                </Txt>
              </View>

              <View style={{ flex: 1 }}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  style={{ flex: 1 }}
                  contentContainerStyle={S.chatArea}
                >
                  {aiMessages.map((m, i) => (
                    <View
                      key={i}
                      style={[S.bubble, m.from === "user" ? S.mine : S.theirs]}
                    >
                      <Txt
                        style={{
                          fontSize: 12,
                          lineHeight: 20,
                        }}
                      >
                        {m.text}
                      </Txt>
                    </View>
                  ))}
                </ScrollView>

                <View style={S.sendRow}>
                  <TextInput
                    value={aiInput}
                    onChangeText={setAiInput}
                    placeholder="Ceritakan atau tanyakan sesuatu..."
                    placeholderTextColor="#A89AA0"
                    multiline
                    style={S.messageInput}
                  />

                  <Pressable style={S.send} onPress={sendAI}>
                    <I name="send" color={C.white} size={19} />
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - DAFTAR PSIKIATER */}
          {/* ============================== */}

          {page === "p-list" && (
            <>
              <Header title="Daftar Psikiater" back={() => change("p-home")} />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.content}
              >
                <Field
                  label="Cari Psikiater"
                  value={search}
                  change={setSearch}
                  placeholder="Cari nama atau bidang..."
                />

                {doctorChoices
                  .filter((d) =>
                    (doctorNameById(d.id) + " " + d.bidang)
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .map((d) => (
                    <Card key={d.id}>
                      <View style={S.personRow}>
                        <Avatar icon="medkit-outline" />

                        <View style={{ flex: 1 }}>
                          <Txt weight="semi" style={{ fontSize: 13 }}>
                            {doctorNameById(d.id)}
                          </Txt>

                          <Txt style={S.small}>{d.bidang}</Txt>

                          <Txt style={S.small}>
                            ★ {d.rating} •{" "}
                            {formatRp(
                              d.id === "rina" ? Number(fee) || 300000 : d.harga,
                            )}
                          </Txt>
                        </View>
                      </View>

                      <View style={{ marginTop: 13 }}>
                        <Button
                          text="Lihat Profil & Booking"
                          onPress={() => {
                            setSelectedDoc(d.id);
                            change("p-detail");
                          }}
                        />
                      </View>
                    </Card>
                  ))}
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - BOOKING */}
          {/* ============================== */}

          {page === "p-detail" && (
            <>
              <Header
                title="Detail Psikiater & Booking"
                back={() => change("p-list")}
              />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.content}
              >
                <Card>
                  <View style={S.personRow}>
                    <Avatar icon="medkit-outline" />

                    <View style={{ flex: 1 }}>
                      <Txt weight="semi">{doctorNameById(doctor.id)}</Txt>

                      <Txt style={S.small}>{doctor.bidang}</Txt>

                      <Txt style={S.small}>
                        ★ {doctor.rating} • Akun demo belum diverifikasi
                      </Txt>
                    </View>
                  </View>
                </Card>

                <Txt weight="semi" style={S.section}>
                  Pilih Tanggal
                </Txt>

                <View style={S.chips}>
                  {dates.map((d) => (
                    <Pill
                      key={d}
                      label={d}
                      active={date === d}
                      press={() => setDate(d)}
                    />
                  ))}
                </View>

                <Txt weight="semi" style={S.section}>
                  Pilih Waktu
                </Txt>

                <View style={S.chips}>
                  {times.map((t) => (
                    <Pill
                      key={t}
                      label={t}
                      active={time === t}
                      press={() => setTime(t)}
                    />
                  ))}
                </View>

                <Txt weight="semi" style={S.section}>
                  Jenis Konsultasi
                </Txt>

                <View style={S.chips}>
                  {(["Telepon", "Video Call"] as const).map((m) => (
                    <Pill
                      key={m}
                      label={m}
                      active={method === m}
                      press={() => setMethod(m)}
                    />
                  ))}
                </View>

                <Field
                  label="Keluhan Singkat (Data Demo)"
                  value={complaint}
                  change={setComplaint}
                  placeholder="Misalnya: sulit tidur dan cemas"
                  multiline
                />

                <Card>
                  <View style={S.moneyRow}>
                    <Txt style={S.muted}>Biaya konsultasi</Txt>

                    <Txt weight="semi">
                      {formatRp(
                        doctor.id === "rina"
                          ? Number(fee) || 300000
                          : doctor.harga,
                      )}
                    </Txt>
                  </View>

                  <Txt style={S.small}>
                    Pembayaran hanya simulasi. Booking menunggu persetujuan
                    psikiater.
                  </Txt>
                </Card>

                <Button
                  text="Kirim Permintaan Booking"
                  onPress={() => {
                    if (!complaint.trim()) {
                      setNotice("Isi keluhan singkat untuk booking.");
                      return;
                    }

                    if (!available) {
                      setNotice("Slot ini tidak tersedia.");
                      return;
                    }

                    if (isTaken(doctor.id, date, time)) {
                      setNotice("Jadwal sudah dipesan.");
                      return;
                    }

                    const harga =
                      doctor.id === "rina"
                        ? Number(fee) || 300000
                        : doctor.harga;

                    const id = Math.max(0, ...bookings.map((b) => b.id)) + 1;

                    setBookings((old) => [
                      ...old,
                      {
                        id,
                        pasien: patientName,
                        dokterId: doctor.id,
                        tanggal: date,
                        waktu: time,
                        metode: method,
                        keluhan: complaint.trim(),
                        harga,
                        status: "masuk",
                      },
                    ]);

                    setComplaint("");
                    change("p-history");

                    setNotice("Booking berhasil dikirim.");
                  }}
                />
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - PEMBAYARAN */}
          {/* ============================== */}

          {page === "p-payment" && (
            <>
              <Header
                title="Pembayaran Simulasi"
                back={() => change("p-history-detail")}
              />

              <ScrollView contentContainerStyle={S.content}>
                <View style={S.softBox}>
                  <Txt style={S.small}>
                    DEMO SAJA. Tidak ada uang sungguhan.
                  </Txt>
                </View>

                <Card>
                  <Txt weight="semi">{doctorNameById(selected.dokterId)}</Txt>

                  <Txt style={S.small}>
                    {selected.tanggal} • {selected.waktu}
                  </Txt>

                  <Txt
                    weight="bold"
                    style={{
                      fontSize: 25,
                      marginVertical: 15,
                    }}
                  >
                    {formatRp(selected.harga)}
                  </Txt>

                  <Txt weight="semi" style={S.section}>
                    Pilih Metode Demo
                  </Txt>

                  <View style={S.chips}>
                    {["BCA", "BRI", "QRIS"].map((m) => (
                      <Pill
                        key={m}
                        label={m}
                        active={paymentMethod === m}
                        press={() => setPaymentMethod(m)}
                      />
                    ))}
                  </View>

                  <Button
                    text={`Bayar (Demo ${paymentMethod})`}
                    onPress={() => {
                      if (
                        selected.status !== "menunggu_bayar" ||
                        selected.pasien !== patientName
                      ) {
                        setNotice("Booking belum dapat dibayar.");
                        return;
                      }

                      setStatus(selected.id, "terkonfirmasi");

                      change("p-history-detail");

                      setNotice("Pembayaran demo berhasil.");
                    }}
                  />
                </Card>
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - SESI */}
          {/* ============================== */}

          {page === "p-session" && (
            <>
              <Header
                title={`Konsultasi • ${doctorNameById(selected.dokterId)}`}
                back={() => change("p-history-detail")}
              />

              <View style={S.softBox}>
                <Txt style={S.small}>
                  Chat dan panggilan merupakan demo antarmuka.
                </Txt>
              </View>

              <View style={{ flex: 1 }}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  style={{ flex: 1 }}
                  contentContainerStyle={S.chatArea}
                >
                  {chatForSession.map((m, i) => (
                    <View
                      key={i}
                      style={[
                        S.bubble,
                        m.from === "pasien" ? S.mine : S.theirs,
                      ]}
                    >
                      <Txt
                        style={{
                          fontSize: 12,
                          lineHeight: 20,
                        }}
                      >
                        {m.text}
                      </Txt>
                    </View>
                  ))}
                </ScrollView>

                <View style={S.sendRow}>
                  <TextInput
                    value={sessionInput}
                    onChangeText={setSessionInput}
                    placeholder="Ketik pesan..."
                    placeholderTextColor="#A89AA0"
                    style={S.messageInput}
                  />

                  <Pressable style={S.send} onPress={sendSession}>
                    <I name="send" size={19} color={C.white} />
                  </Pressable>
                </View>

                <View style={S.callRow}>
                  <Button
                    text="Telepon (Demo)"
                    outline
                    onPress={() => setNotice("Telepon belum terintegrasi.")}
                  />

                  <Button
                    text="Video Call (Demo)"
                    outline
                    onPress={() => setNotice("Video Call belum terintegrasi.")}
                  />
                </View>
              </View>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - RIWAYAT */}
          {/* ============================== */}

          {page === "p-history" && (
            <>
              <Header title="Riwayat Konsultasi" />

              <ScrollView contentContainerStyle={S.content}>
                {myBookings.length === 0 && (
                  <Card>
                    <Txt style={S.muted}>Belum ada riwayat konsultasi.</Txt>
                  </Card>
                )}

                {myBookings
                  .slice()
                  .reverse()
                  .map((b) => (
                    <Card key={b.id}>
                      <View style={S.personRow}>
                        <Avatar icon="medkit-outline" />

                        <View style={{ flex: 1 }}>
                          <Txt weight="semi">{doctorNameById(b.dokterId)}</Txt>

                          <Txt style={S.small}>
                            {b.tanggal} • {b.waktu}
                          </Txt>

                          <Txt style={S.small}>{b.metode}</Txt>
                        </View>
                      </View>

                      <View
                        style={{
                          marginVertical: 12,
                        }}
                      >
                        <StatusTag status={b.status} />
                      </View>

                      <Button
                        text="Lihat Detail Riwayat"
                        onPress={() => openHistoryDetail(b.id)}
                      />
                    </Card>
                  ))}
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - DETAIL RIWAYAT */}
          {/* ============================== */}

          {page === "p-history-detail" && (
            <>
              <Header
                title="Detail Riwayat Konsultasi"
                back={() => change("p-history")}
              />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.content}
              >
                {/* STATUS KONSULTASI */}
                <View style={S.detailHero}>
                  <View style={S.detailHeroIcon}>
                    <I name="receipt-outline" size={27} color={C.accent} />
                  </View>

                  <Txt weight="semi" style={{ fontSize: 16 }}>
                    Konsultasi #{selected.id}
                  </Txt>

                  <StatusTag status={selected.status} />

                  <Txt style={S.small}>
                    Informasi pemesanan dan konsultasi pribadi
                  </Txt>
                </View>

                {/* INFORMASI PSIKIATER */}
                <Card>
                  <Txt weight="semi" style={S.section}>
                    Informasi Psikiater
                  </Txt>

                  <View style={S.personRow}>
                    <Avatar icon="medkit-outline" />

                    <View style={{ flex: 1 }}>
                      <Txt weight="semi">
                        {doctorNameById(selected.dokterId)}
                      </Txt>

                      <Txt style={S.small}>
                        {selected.dokterId === "rina"
                          ? specialty
                          : doctorChoices.find(
                              (d) => d.id === selected.dokterId,
                            )?.bidang || "Psikiater"}
                      </Txt>
                    </View>
                  </View>
                </Card>

                {/* INFORMASI SESI */}
                <Card>
                  <Txt weight="semi" style={S.section}>
                    Informasi Sesi
                  </Txt>

                  <View style={S.detailRow}>
                    <Txt style={S.muted}>Pasien</Txt>
                    <Txt weight="medium" style={S.detailValue}>
                      {selected.pasien}
                    </Txt>
                  </View>

                  <View style={S.detailRow}>
                    <Txt style={S.muted}>Tanggal</Txt>
                    <Txt weight="medium" style={S.detailValue}>
                      {selected.tanggal}
                    </Txt>
                  </View>

                  <View style={S.detailRow}>
                    <Txt style={S.muted}>Waktu</Txt>
                    <Txt weight="medium" style={S.detailValue}>
                      {selected.waktu}
                    </Txt>
                  </View>

                  <View style={S.detailRow}>
                    <Txt style={S.muted}>Jenis Layanan</Txt>
                    <Txt weight="medium" style={S.detailValue}>
                      {selected.metode}
                    </Txt>
                  </View>

                  <View style={S.detailRow}>
                    <Txt style={S.muted}>Status</Txt>
                    <Txt weight="medium" style={S.detailValue}>
                      {statusText[selected.status]}
                    </Txt>
                  </View>
                </Card>

                {/* KELUHAN */}
                <Card>
                  <Txt weight="semi" style={S.section}>
                    Keluhan Saat Booking
                  </Txt>

                  <View style={S.softBox}>
                    <Txt style={S.muted}>{selected.keluhan}</Txt>
                  </View>

                  <Txt style={S.small}>
                    Ini adalah keluhan yang ditulis saat booking, bukan
                    diagnosis atau catatan medis.
                  </Txt>
                </Card>

                {/* PEMBAYARAN */}
                <Card>
                  <Txt weight="semi" style={S.section}>
                    Rincian Pembayaran
                  </Txt>

                  <View style={S.detailRow}>
                    <Txt style={S.muted}>Biaya Konsultasi</Txt>

                    <Txt weight="semi">{formatRp(selected.harga)}</Txt>
                  </View>

                  <View style={S.detailRow}>
                    <Txt style={S.muted}>Status Pembayaran</Txt>

                    <Txt weight="medium" style={S.detailValue}>
                      {["terkonfirmasi", "selesai"].includes(selected.status)
                        ? "Lunas (Demo)"
                        : selected.status === "menunggu_bayar"
                          ? "Belum Dibayar"
                          : selected.status === "masuk"
                            ? "Belum Ditagihkan"
                            : "Tidak Diproses"}
                    </Txt>
                  </View>

                  <Txt style={S.small}>
                    Pembayaran masih simulasi dan tidak melibatkan uang nyata.
                  </Txt>
                </Card>

                {/* PROGRES BOOKING */}
                <Card>
                  <Txt weight="semi" style={S.section}>
                    Perjalanan Konsultasi
                  </Txt>

                  {(
                    [
                      "masuk",
                      "menunggu_bayar",
                      "terkonfirmasi",
                      "selesai",
                    ] as Status[]
                  ).map((st, i) => {
                    const order: Status[] = [
                      "masuk",
                      "menunggu_bayar",
                      "terkonfirmasi",
                      "selesai",
                    ];

                    const finishedSteps = order.indexOf(selected.status);

                    const reached =
                      finishedSteps >= i ||
                      (i === 0 &&
                        ["ditolak", "dibatalkan"].includes(selected.status));

                    return (
                      <View key={st} style={S.timelineRow}>
                        <I
                          name={
                            reached ? "checkmark-circle" : "ellipse-outline"
                          }
                          color={reached ? C.accent : C.muted}
                          size={19}
                        />

                        <Txt
                          weight={reached ? "medium" : "regular"}
                          style={{
                            fontSize: 12,
                            flex: 1,
                          }}
                        >
                          {
                            [
                              "Permintaan dikirim",
                              "Diterima psikiater",
                              "Pembayaran demo selesai",
                              "Konsultasi selesai",
                            ][i]
                          }
                        </Txt>
                      </View>
                    );
                  })}

                  {["ditolak", "dibatalkan"].includes(selected.status) && (
                    <Txt style={[S.muted, { marginTop: 8 }]}>
                      Booking ini {statusText[selected.status].toLowerCase()}.
                    </Txt>
                  )}
                </Card>

                {/* TOMBOL SESUAI STATUS */}
                {selected.status === "menunggu_bayar" && (
                  <Button
                    text="Lanjut ke Pembayaran Demo"
                    onPress={() => change("p-payment")}
                  />
                )}

                {selected.status === "terkonfirmasi" && (
                  <Button
                    text="Masuk Ruang Konsultasi"
                    onPress={() => change("p-session")}
                  />
                )}

                {["masuk", "menunggu_bayar"].includes(selected.status) && (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <Button
                      text="Batalkan Booking (Demo)"
                      outline
                      onPress={() => {
                        setStatus(selected.id, "dibatalkan");

                        setNotice("Booking demo dibatalkan.");
                      }}
                    />
                  </View>
                )}

                {/* ULASAN SETELAH SELESAI */}
                {selected.status === "selesai" && (
                  <Card>
                    <Txt weight="semi" style={S.section}>
                      Ulasan Konsultasi
                    </Txt>

                    <Txt style={S.muted}>
                      Beri penilaian untuk konsultasi yang telah selesai.
                    </Txt>

                    <View style={S.ratingRow}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Pressable
                          key={n}
                          onPress={() => setRatingDraft(n)}
                          hitSlop={6}
                        >
                          <I
                            name={n <= ratingDraft ? "star" : "star-outline"}
                            color={C.accent}
                            size={31}
                          />
                        </Pressable>
                      ))}
                    </View>

                    <Field
                      label="Komentar (Opsional)"
                      value={reviewDraft}
                      change={setReviewDraft}
                      placeholder="Bagaimana pengalaman konsultasimu?"
                      multiline
                    />

                    <Button
                      text={
                        reviews[selected.id]
                          ? "Perbarui Ulasan"
                          : "Simpan Ulasan (Demo)"
                      }
                      onPress={() => {
                        if (ratingDraft < 1) {
                          setNotice("Pilih bintang dahulu.");
                          return;
                        }

                        setReviews((old) => ({
                          ...old,
                          [selected.id]: {
                            rating: ratingDraft,
                            note: reviewDraft.trim(),
                          },
                        }));

                        setNotice("Ulasan demo tersimpan.");
                      }}
                    />
                  </Card>
                )}

                <View
                  style={{
                    marginTop: 8,
                  }}
                >
                  <Button
                    text="Kembali ke Riwayat"
                    outline
                    onPress={() => change("p-history")}
                  />
                </View>
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PASIEN - PROFIL */}
          {/* ============================== */}

          {page === "p-profile" && (
            <>
              <Header title="Profil Pasien" />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.content}
              >
                <View style={S.profileTop}>
                  <Avatar />

                  <Txt weight="semi" style={S.cardTitle}>
                    {patientName}
                  </Txt>

                  <Txt style={S.muted}>{email || "pasien@mindcare.demo"}</Txt>
                </View>

                <Card>
                  <Field
                    label="Nama Lengkap"
                    value={patientName}
                    change={setPatientName}
                  />

                  <Button
                    text="Simpan Profil (Demo)"
                    onPress={() =>
                      setNotice("Profil pasien berhasil diperbarui.")
                    }
                  />

                  <View style={{ height: 12 }} />

                  <Button text="Logout / Ganti Role" outline onPress={logout} />
                </Card>
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PSIKIATER - DASHBOARD */}
          {/* ============================== */}

          {page === "d-home" && (
            <>
              <Header title="MindCare • Dashboard Psikiater" />

              <ScrollView contentContainerStyle={S.content}>
                <View style={S.greeting}>
                  <View style={{ flex: 1 }}>
                    <Txt style={S.muted}>Selamat datang kembali 👋</Txt>

                    <Txt weight="bold" style={S.title}>
                      {doctorName.split(",")[0]}
                    </Txt>
                  </View>

                  <Avatar icon="medkit-outline" />
                </View>

                <View style={S.hero}>
                  <I name="heart-circle-outline" size={36} color={C.accent} />

                  <Txt weight="semi" style={S.cardTitle}>
                    Terima kasih sudah membantu orang lain.
                  </Txt>

                  <Txt style={S.muted}>
                    Kelola jadwal, konsultasi, dan penghasilan demo.
                  </Txt>
                </View>

                <Txt weight="semi" style={S.section}>
                  Ringkasan
                </Txt>

                <View style={S.stats}>
                  <View style={S.stat}>
                    <I name="people-outline" />

                    <Txt weight="bold" style={S.bigNum}>
                      {
                        doctorBookings.filter((b) => b.status === "masuk")
                          .length
                      }
                    </Txt>

                    <Txt style={S.small}>Permintaan</Txt>
                  </View>

                  <View style={S.stat}>
                    <I name="calendar-outline" />

                    <Txt weight="bold" style={S.bigNum}>
                      {slots.filter((x) => x.active).length}
                    </Txt>

                    <Txt style={S.small}>Jadwal</Txt>
                  </View>

                  <View style={S.stat}>
                    <I name="checkmark-circle-outline" />

                    <Txt weight="bold" style={S.bigNum}>
                      {completed.length}
                    </Txt>

                    <Txt style={S.small}>Selesai</Txt>
                  </View>
                </View>

                <Pressable
                  style={S.balanceCard}
                  onPress={() => change("d-wallet")}
                >
                  <View style={{ flex: 1 }}>
                    <Txt style={S.muted}>Saldo Tersedia (Demo)</Txt>

                    <Txt
                      weight="bold"
                      style={{
                        fontSize: 25,
                      }}
                    >
                      {formatRp(balance)}
                    </Txt>
                  </View>

                  <I name="chevron-forward-outline" color={C.accent} />
                </Pressable>

                {[
                  {
                    label: "Kelola Jadwal",
                    icon: "calendar-outline" as IconName,
                    target: "d-schedule" as Page,
                  },
                  {
                    label: "Permintaan Konsultasi",
                    icon: "people-outline" as IconName,
                    target: "d-bookings" as Page,
                  },
                  {
                    label: "Saldo & Pendapatan",
                    icon: "wallet-outline" as IconName,
                    target: "d-wallet" as Page,
                  },
                  {
                    label: "Profil Psikiater",
                    icon: "person-outline" as IconName,
                    target: "d-profile" as Page,
                  },
                ].map((x) => (
                  <Pressable
                    key={x.target}
                    style={S.menu}
                    onPress={() => change(x.target)}
                  >
                    <Avatar icon={x.icon} />

                    <Txt weight="medium" style={{ flex: 1 }}>
                      {x.label}
                    </Txt>

                    <I name="chevron-forward-outline" size={18} />
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PSIKIATER - JADWAL */}
          {/* ============================== */}

          {page === "d-schedule" && (
            <>
              <Header title="Kelola Jadwal" back={() => change("d-home")} />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.content}
              >
                <View style={S.softBox}>
                  <Txt style={S.muted}>
                    Ketuk waktu untuk mengaktifkan atau menonaktifkan slot demo.
                  </Txt>
                </View>

                {slots.map((slot, i) => (
                  <Pressable
                    key={i}
                    style={S.slot}
                    onPress={() => {
                      if (
                        bookings.some(
                          (b) =>
                            b.dokterId === "rina" &&
                            b.waktu === slot.time &&
                            !["selesai", "ditolak", "dibatalkan"].includes(
                              b.status,
                            ),
                        )
                      ) {
                        setNotice("Ada booking aktif pada slot ini.");
                        return;
                      }

                      setSlots((old) =>
                        old.map((x, j) =>
                          i === j
                            ? {
                                ...x,
                                active: !x.active,
                              }
                            : x,
                        ),
                      );
                    }}
                  >
                    <I
                      name={slot.active ? "checkbox" : "square-outline"}
                      color={slot.active ? C.accent : C.muted}
                    />

                    <Txt
                      weight="medium"
                      style={{
                        flex: 1,
                        marginLeft: 12,
                      }}
                    >
                      {slot.time}
                    </Txt>

                    <Txt style={S.small}>
                      {slot.active ? "Tersedia" : "Nonaktif"}
                    </Txt>
                  </Pressable>
                ))}

                <Card>
                  <Field
                    label="Tambah Slot Baru"
                    value={newSlot}
                    change={setNewSlot}
                    placeholder="16.00 - 16.30"
                  />

                  <Button
                    text="+ Tambah Jadwal"
                    onPress={() => {
                      const t = newSlot.trim();

                      if (!/^\d{2}\.\d{2} - \d{2}\.\d{2}$/.test(t)) {
                        setNotice("Gunakan format 16.00 - 16.30.");
                        return;
                      }

                      if (slots.some((x) => x.time === t)) {
                        setNotice("Slot sudah tersedia.");
                        return;
                      }

                      setSlots((old) => [
                        ...old,
                        {
                          time: t,
                          active: true,
                        },
                      ]);

                      setNewSlot("");

                      setNotice("Slot demo ditambahkan.");
                    }}
                  />
                </Card>
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PSIKIATER - BOOKING */}
          {/* ============================== */}

          {page === "d-bookings" && (
            <>
              <Header title="Permintaan Konsultasi" />

              <ScrollView contentContainerStyle={S.content}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{
                    marginBottom: 13,
                  }}
                >
                  {(
                    [
                      ["semua", "Semua"],
                      ["masuk", "Masuk"],
                      ["menunggu_bayar", "Menunggu Bayar"],
                      ["terkonfirmasi", "Terkonfirmasi"],
                      ["selesai", "Selesai"],
                      ["ditolak", "Ditolak"],
                    ] as const
                  ).map(([id, label]) => (
                    <Pill
                      key={id}
                      label={label}
                      active={bookingFilter === id}
                      press={() => setBookingFilter(id)}
                    />
                  ))}
                </ScrollView>

                {doctorBookings
                  .filter(
                    (b) =>
                      bookingFilter === "semua" || b.status === bookingFilter,
                  )
                  .slice()
                  .reverse()
                  .map((b) => (
                    <Card key={b.id}>
                      <View style={S.personRow}>
                        <Avatar />

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Txt weight="semi">{b.pasien}</Txt>

                          <Txt style={S.small}>
                            {b.tanggal} • {b.waktu} • {b.metode}
                          </Txt>
                        </View>
                      </View>

                      <View
                        style={{
                          marginVertical: 12,
                        }}
                      >
                        <StatusTag status={b.status} />
                      </View>

                      <Txt
                        style={[
                          S.muted,
                          {
                            marginBottom: 10,
                          },
                        ]}
                      >
                        {b.keluhan}
                      </Txt>

                      <Button
                        text="Lihat Detail"
                        onPress={() => {
                          setSelectedBooking(b.id);
                          change("d-detail");
                        }}
                      />
                    </Card>
                  ))}
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PSIKIATER - DETAIL */}
          {/* ============================== */}

          {page === "d-detail" && (
            <>
              <Header
                title="Detail Pasien / Sesi"
                back={() => change("d-bookings")}
              />

              <ScrollView contentContainerStyle={S.content}>
                <Card>
                  <View style={S.personRow}>
                    <Avatar />

                    <View style={{ flex: 1 }}>
                      <Txt weight="semi">{selected.pasien}</Txt>

                      <Txt style={S.small}>Data simulasi</Txt>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: 12,
                    }}
                  >
                    <StatusTag status={selected.status} />
                  </View>
                </Card>

                <Card>
                  <Txt weight="semi" style={S.section}>
                    Keluhan Utama
                  </Txt>

                  <View style={S.softBox}>
                    <Txt style={S.muted}>{selected.keluhan}</Txt>
                  </View>

                  <Txt style={S.muted}>Tanggal: {selected.tanggal}</Txt>

                  <Txt style={S.muted}>Waktu: {selected.waktu}</Txt>

                  <Txt style={S.muted}>Metode: {selected.metode}</Txt>

                  <Txt style={S.muted}>Tarif: {formatRp(selected.harga)}</Txt>
                </Card>

                {selected.status === "masuk" && (
                  <View style={S.actionRow}>
                    <View style={{ flex: 1 }}>
                      <Button
                        text="Terima"
                        onPress={() => {
                          setStatus(selected.id, "menunggu_bayar");

                          setNotice("Diterima. Pasien perlu membayar (demo).");
                        }}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Button
                        text="Tolak"
                        outline
                        onPress={() => {
                          setStatus(selected.id, "ditolak");

                          change("d-bookings");

                          setNotice("Permintaan ditolak.");
                        }}
                      />
                    </View>
                  </View>
                )}

                {selected.status === "menunggu_bayar" && (
                  <View style={S.softBox}>
                    <Txt style={S.muted}>
                      Menunggu pasien menyelesaikan pembayaran demo. Psikiater
                      tidak boleh menandai pembayaran sendiri.
                    </Txt>
                  </View>
                )}

                {selected.status === "terkonfirmasi" && (
                  <Button
                    text="Mulai Konsultasi"
                    onPress={() => change("d-chat")}
                  />
                )}

                {selected.status === "selesai" && (
                  <View style={S.softBox}>
                    <Txt style={S.muted}>
                      Konsultasi selesai. Pendapatan bersih{" "}
                      {formatRp(bersih(selected.harga))} masuk ke saldo demo.
                    </Txt>
                  </View>
                )}
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PSIKIATER - CHAT */}
          {/* ============================== */}

          {page === "d-chat" && (
            <>
              <Header
                title={`Sesi • ${selected.pasien}`}
                back={() => change("d-detail")}
              />

              <View style={S.softBox}>
                <Txt style={S.small}>
                  Mode demo. Audio dan video call belum tersambung.
                </Txt>
              </View>

              <View style={{ flex: 1 }}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  style={{ flex: 1 }}
                  contentContainerStyle={S.chatArea}
                >
                  {chatForSession.map((m, i) => (
                    <View
                      key={i}
                      style={[
                        S.bubble,
                        m.from === "psikiater" ? S.mine : S.theirs,
                      ]}
                    >
                      <Txt
                        style={{
                          fontSize: 12,
                          lineHeight: 20,
                        }}
                      >
                        {m.text}
                      </Txt>
                    </View>
                  ))}
                </ScrollView>

                <View style={S.sendRow}>
                  <TextInput
                    value={sessionInput}
                    onChangeText={setSessionInput}
                    placeholder="Ketik pesan..."
                    placeholderTextColor="#A89AA0"
                    style={S.messageInput}
                  />

                  <Pressable style={S.send} onPress={sendSession}>
                    <I name="send" size={19} color={C.white} />
                  </Pressable>
                </View>

                <View style={S.callRow}>
                  <Button
                    text="Telepon (Demo)"
                    outline
                    onPress={() => setNotice("Telepon belum terintegrasi.")}
                  />

                  <Button
                    text="Video Call (Demo)"
                    outline
                    onPress={() => setNotice("Video call belum terintegrasi.")}
                  />
                </View>

                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingBottom: 10,
                  }}
                >
                  <Button
                    text="Selesaikan Konsultasi"
                    onPress={() => {
                      if (selected.status !== "terkonfirmasi") {
                        return;
                      }

                      setStatus(selected.id, "selesai");

                      change("d-wallet");

                      setNotice("Sesi selesai. Penghasilan masuk saldo demo.");
                    }}
                  />
                </View>
              </View>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PSIKIATER - SALDO */}
          {/* ============================== */}

          {page === "d-wallet" && (
            <>
              <Header title="Saldo & Pendapatan" />

              <ScrollView contentContainerStyle={S.content}>
                <View style={S.hero}>
                  <I name="wallet-outline" color={C.accent} size={35} />

                  <Txt style={S.muted}>Saldo Tersedia (Simulasi)</Txt>

                  <Txt
                    weight="bold"
                    style={{
                      fontSize: 30,
                    }}
                  >
                    {formatRp(balance)}
                  </Txt>
                </View>

                <Card>
                  <View style={S.moneyRow}>
                    <Txt style={S.muted}>Pendapatan Kotor</Txt>

                    <Txt weight="medium">
                      {formatRp(completed.reduce((a, b) => a + b.harga, 0))}
                    </Txt>
                  </View>

                  <View style={S.moneyRow}>
                    <Txt style={S.muted}>Komisi Platform 10%</Txt>

                    <Txt weight="medium">
                      -
                      {formatRp(
                        completed.reduce(
                          (a, b) => a + Math.round(b.harga * 0.1),
                          0,
                        ),
                      )}
                    </Txt>
                  </View>

                  <View style={S.moneyRow}>
                    <Txt style={S.muted}>Pencairan Demo</Txt>

                    <Txt weight="medium">-{formatRp(withdrawn)}</Txt>
                  </View>

                  <View style={S.divider} />

                  <View style={S.moneyRow}>
                    <Txt weight="semi">Saldo Tersedia</Txt>

                    <Txt weight="bold">{formatRp(balance)}</Txt>
                  </View>

                  <Button
                    text="Ajukan Pencairan (Demo)"
                    disabled={balance <= 0}
                    onPress={() => {
                      if (balance <= 0) {
                        return;
                      }

                      setWithdrawals((old) => [...old, balance]);

                      setNotice(
                        "Pencairan hanya demo. Tidak ada transfer uang.",
                      );
                    }}
                  />
                </Card>

                <Txt weight="semi" style={S.section}>
                  Riwayat Penghasilan
                </Txt>

                {completed.map((b) => (
                  <Card key={b.id}>
                    <View style={S.moneyRow}>
                      <View>
                        <Txt weight="medium">{b.pasien}</Txt>

                        <Txt style={S.small}>{b.tanggal} • Selesai</Txt>
                      </View>

                      <Txt weight="semi">+{formatRp(bersih(b.harga))}</Txt>
                    </View>
                  </Card>
                ))}

                {withdrawals.map((amount, i) => (
                  <Card key={i}>
                    <View style={S.moneyRow}>
                      <Txt weight="medium">Pencairan Demo</Txt>

                      <Txt weight="semi">-{formatRp(amount)}</Txt>
                    </View>
                  </Card>
                ))}
              </ScrollView>
            </>
          )}

          {/* ============================== */}
          {/* ROLE PSIKIATER - PROFIL */}
          {/* ============================== */}

          {page === "d-profile" && (
            <>
              <Header title="Profil Psikiater" />

              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={S.content}
              >
                <View style={S.profileTop}>
                  <Avatar icon="medkit-outline" />

                  <Txt weight="semi" style={S.cardTitle}>
                    {doctorName}
                  </Txt>

                  <Txt style={S.muted}>
                    {email || "psikiater@mindcare.demo"}
                  </Txt>

                  <View style={S.tag}>
                    <Txt style={S.small}>
                      Akun simulasi / belum diverifikasi
                    </Txt>
                  </View>
                </View>

                <Card>
                  <Field
                    label="Nama Lengkap"
                    value={doctorName}
                    change={setDoctorName}
                  />

                  <Field
                    label="Spesialisasi"
                    value={specialty}
                    change={setSpecialty}
                  />

                  <Field
                    label="Biaya Konsultasi (Rp)"
                    value={fee}
                    change={setFee}
                    keyboardType="numeric"
                  />

                  <Button
                    text="Simpan Perubahan (Demo)"
                    onPress={() => setNotice("Profil lokal diperbarui.")}
                  />

                  <View style={{ height: 12 }} />

                  <Button text="Logout / Ganti Role" outline onPress={logout} />
                </Card>
              </ScrollView>
            </>
          )}

          {/* NAVIGASI BAWAH */}
          {role && mainPages.includes(page) && !keyboardVisible && (
            <BottomBar role={role} page={page} go={change} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =======================================
// STYLING MINDCARE
// =======================================

const S = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  keyboardRoot: {
    flex: 1,
  },

  app: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: C.bg,
  },

  loading: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 18,
    paddingBottom: 30,
  },

  welcome: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    alignItems: "center",
  },

  logo: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: C.peach,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  brand: {
    fontSize: 35,
    marginBottom: 8,
  },

  card: {
    padding: 17,
    marginBottom: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    width: "100%",
  },

  cardTitle: {
    fontSize: 17,
    marginBottom: 7,
  },

  muted: {
    fontSize: 12,
    lineHeight: 20,
    color: C.muted,
  },

  small: {
    fontSize: 11,
    color: C.muted,
    lineHeight: 18,
  },

  label: {
    fontSize: 12,
    marginBottom: 6,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 13,
    paddingHorizontal: 12,
    minHeight: 49,
  },

  input: {
    flex: 1,
    minHeight: 45,
    paddingVertical: 8,
    fontSize: 13,
    color: C.dark,
    fontFamily: F.regular,
  },

  btn: {
    minHeight: 47,
    paddingHorizontal: 13,
    paddingVertical: 9,
    backgroundColor: C.pink,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  btnOutline: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.pink,
  },

  btnText: {
    fontSize: 12,
    textAlign: "center",
  },

  header: {
    paddingHorizontal: 18,
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: C.line,
  },

  pill: {
    backgroundColor: C.peach,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  pillActive: {
    backgroundColor: C.accent,
  },

  tag: {
    alignSelf: "flex-start",
    backgroundColor: C.peach,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },

  avatar: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: C.peach,
    alignItems: "center",
    justifyContent: "center",
  },

  bottom: {
    flexDirection: "row",
    backgroundColor: C.white,
    paddingTop: 10,
    paddingBottom: 9,
    borderTopWidth: 1,
    borderColor: C.line,
  },

  bottomItem: {
    flex: 1,
    gap: 4,
    alignItems: "center",
  },

  link: {
    color: C.accent,
    fontSize: 11,
    textAlign: "center",
    textDecorationLine: "underline",
  },

  notice: {
    backgroundColor: C.peach,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  section: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 13,
  },

  roleCard: {
    width: "100%",
    padding: 15,
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    marginBottom: 12,
  },

  greeting: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  title: {
    fontSize: 22,
  },

  hero: {
    backgroundColor: C.peach,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    gap: 7,
  },

  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 11,
    marginBottom: 16,
  },

  tile: {
    width: "48%",
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    padding: 23,
    gap: 10,
    alignItems: "center",
  },

  softBox: {
    backgroundColor: C.peach,
    borderRadius: 14,
    padding: 13,
    margin: 13,
  },

  chatArea: {
    padding: 15,
    flexGrow: 1,
  },

  bubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 17,
    marginBottom: 11,
  },

  mine: {
    alignSelf: "flex-end",
    backgroundColor: C.peach,
  },

  theirs: {
    alignSelf: "flex-start",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
  },

  sendRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
    gap: 9,
  },

  messageInput: {
    flex: 1,
    borderRadius: 14,
    minHeight: 46,
    maxHeight: 96,
    padding: 12,
    fontFamily: F.regular,
    color: C.dark,
    fontSize: 12,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
  },

  send: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: C.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  moneyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 13,
  },

  divider: {
    height: 1,
    backgroundColor: C.line,
    marginBottom: 14,
  },

  callRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    justifyContent: "space-between",
  },

  profileTop: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },

  stats: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 20,
  },

  stat: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.line,
    paddingVertical: 15,
    alignItems: "center",
  },

  bigNum: {
    fontSize: 23,
    marginTop: 7,
  },

  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 19,
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 20,
  },

  menu: {
    padding: 13,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  slot: {
    padding: 17,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  // DETAIL RIWAYAT BARU
  detailHero: {
    backgroundColor: C.peach,
    alignItems: "center",
    gap: 9,
    borderRadius: 20,
    padding: 19,
    marginBottom: 15,
  },

  detailHeroIcon: {
    backgroundColor: C.white,
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 13,
    gap: 10,
  },

  detailValue: {
    fontSize: 12,
    flexShrink: 1,
    textAlign: "right",
    maxWidth: "60%",
  },

  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 13,
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 18,
  },
});
