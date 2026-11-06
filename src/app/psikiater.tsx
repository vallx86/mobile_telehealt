
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

// WARNA MINDCARE
const C = {
  bg: '#FFF5F5',
  peach: '#F7D6D0',
  pink: '#E2B4BD',
  dark: '#4A4A4A',
  white: '#FFFFFF',
  muted: '#8A7B7E',
  border: '#F0DDE0',
};

type Page =
  | 'login'
  | 'register'
  | 'dashboard'
  | 'schedule'
  | 'requests'
  | 'detail'
  | 'chat'
  | 'profile';

type Status = 'Masuk' | 'Diproses' | 'Selesai' | 'Ditolak';

type Booking = {
  id: number;
  name: string;
  time: string;
  complaint: string;
  method: string;
  status: Status;
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Weight = 'regular' | 'medium' | 'semi' | 'bold';

const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semi: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

function Txt({
  children,
  weight = 'regular',
  style,
}: {
  children: React.ReactNode;
  weight?: Weight;
  style?: any;
}) {
  return (
    <Text style={[{ fontFamily: fonts[weight], color: C.dark }, style]}>
      {children}
    </Text>
  );
}

function Icon({
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
  title,
  onPress,
  outline = false,
}: {
  title: string;
  onPress: () => void;
  outline?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.button, outline && s.buttonOutline]}
    >
      <Txt weight="semi" style={s.buttonText}>
        {title}
      </Txt>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure = false,
  numeric = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secure?: boolean;
  numeric?: boolean;
}) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Txt weight="medium" style={s.label}>{label}</Txt>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#A89DA0"
        secureTextEntry={secure}
        keyboardType={numeric ? 'numeric' : 'default'}
        style={s.input}
      />
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={s.card}>{children}</View>;
}

function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <View style={s.header}>
      {onBack && (
        <Pressable onPress={onBack} style={s.back}>
          <Icon name="arrow-back" />
        </Pressable>
      )}
      <Txt weight="semi" style={s.headerTitle}>{title}</Txt>
    </View>
  );
}

const initialBookings: Booking[] = [
  {
    id: 1,
    name: 'Andi Pratama',
    time: '10.00 - 10.30',
    complaint: 'Merasa cemas, sulit tidur, dan sering overthinking.',
    method: 'Video Call',
    status: 'Masuk',
  },
  {
    id: 2,
    name: 'Siti Rahma',
    time: '14.00 - 14.30',
    complaint: 'Kesulitan mengelola stres sehari-hari.',
    method: 'Telepon',
    status: 'Masuk',
  },
  {
    id: 3,
    name: 'Rizky Ananda',
    time: '09.00 - 09.30',
    complaint: 'Ingin melakukan konsultasi awal.',
    method: 'Video Call',
    status: 'Masuk',
  },
];

export default function PsikiaterScreen() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [page, setPage] = useState<Page>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Dr. Rina Sari, Sp.KJ');
  const [specialty, setSpecialty] = useState('Psikiatri');
  const [price, setPrice] = useState('300000');
  const [credential, setCredential] = useState('');
  const [phone, setPhone] = useState('');

  const [slots, setSlots] = useState([
    { time: '09.00 - 09.30', active: true },
    { time: '10.00 - 10.30', active: true },
    { time: '11.00 - 11.30', active: false },
    { time: '14.00 - 14.30', active: false },
  ]);

  const [bookings, setBookings] = useState(initialBookings);
  const [tab, setTab] = useState<Status>('Masuk');
  const [selectedId, setSelectedId] = useState(1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      text: 'Selamat siang, Dok. Saya siap untuk konsultasi.',
      mine: false,
    },
    {
      text: 'Selamat siang. Silakan ceritakan kondisi Anda.',
      mine: true,
    },
  ]);

  const activeBooking =
    bookings.find((b) => b.id === selectedId) || bookings[0];

  const updateBooking = (id: number, status: Status) => {
    setBookings((old) =>
      old.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((old) => [
      ...old,
      { text: message.trim(), mine: true },
    ]);
    setMessage('');
  };

  const showCallDemo = (method: string) => {
    Alert.alert(
      `${method} MindCare`,
      'Tampilan sudah siap. Fitur panggilan akan dihubungkan dengan layanan komunikasi nanti.'
    );
  };

  if (!loaded) {
    return (
      <View style={s.loading}>
        <ActivityIndicator size="large" color={C.pink} />
      </View>
    );
  }

  // HALAMAN 1 - LOGIN PSIKIATER
  const renderLogin = () => (
    <ScrollView contentContainerStyle={s.authContainer}>
      <View style={s.logoCircle}>
        <Icon name="heart-outline" size={56} color={C.dark} />
      </View>

      <Txt weight="bold" style={s.brand}>MindCare</Txt>
      <Txt style={s.subtitle}>Masuk sebagai Psikiater</Txt>

      <Card>
        <Txt weight="semi" style={s.cardHeading}>
          Selamat Datang Kembali!
        </Txt>
        <Txt style={s.muted}>
          Masuk untuk mengelola layanan konsultasi Anda.
        </Txt>

        <View style={{ height: 22 }} />

        <Field label="Email" value={email} onChangeText={setEmail} />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secure
        />

        <Button
          title="Masuk"
          onPress={() => {
            if (!email.trim() || !password.trim()) {
              Alert.alert('Perhatian', 'Isi email dan password dahulu.');
              return;
            }
            setPage('dashboard');
          }}
        />

        <Pressable onPress={() => setPage('register')}>
          <Txt style={s.authLink}>
            Belum punya akun? Daftar sebagai Psikiater
          </Txt>
        </Pressable>
      </Card>

      <Txt style={s.demoLabel}>Mode demo frontend MindCare</Txt>
    </ScrollView>
  );

  // HALAMAN 2 - REGISTRASI
  const renderRegister = () => (
    <>
      <Header title="Registrasi Psikiater" onBack={() => setPage('login')} />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.infoBox}>
          <Icon name="medical-outline" color={C.dark} />
          <Txt style={{ flex: 1, marginLeft: 12 }}>
            Daftar mandiri untuk menyediakan layanan konsultasi di MindCare.
          </Txt>
        </View>

        <Card>
          <Field label="Nama Lengkap" value={name} onChangeText={setName} />
          <Field label="Email" value={email} onChangeText={setEmail} />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secure
          />
          <Field
            label="Nomor STR / SIP (Demo)"
            value={credential}
            onChangeText={setCredential}
          />
          <Field
            label="Spesialisasi"
            value={specialty}
            onChangeText={setSpecialty}
          />
          <Field
            label="Nomor Telepon"
            value={phone}
            onChangeText={setPhone}
          />

          <Button
            title="Daftar Sekarang"
            onPress={() => {
              if (!name || !email || !password || !credential || !phone) {
                Alert.alert('Perhatian', 'Lengkapi formulir terlebih dahulu.');
                return;
              }
              Alert.alert(
                'Registrasi Demo Berhasil',
                'Akun psikiater berstatus simulasi / belum diverifikasi.',
                [{ text: 'Lanjut', onPress: () => setPage('dashboard') }]
              );
            }}
          />
        </Card>
      </ScrollView>
    </>
  );

  // HALAMAN 3 - DASHBOARD
  const renderDashboard = () => (
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.greeting}>
        <View style={{ flex: 1 }}>
          <Txt style={s.muted}>Selamat datang kembali 👋</Txt>
          <Txt weight="bold" style={s.pageTitle}>
            Halo, {name.split(',')[0]}!
          </Txt>
          <Txt style={s.muted}>Semoga harimu menyenangkan.</Txt>
        </View>
        <View style={s.avatar}>
          <Icon name="person-outline" size={30} />
        </View>
      </View>

      <View style={s.hero}>
        <Icon name="heart-circle-outline" size={42} color={C.dark} />
        <Txt weight="semi" style={s.cardHeading}>
          Terima kasih telah membantu orang lain.
        </Txt>
        <Txt style={s.muted}>
          Kelola jadwal dan konsultasi dengan nyaman bersama MindCare.
        </Txt>
      </View>

      <Txt weight="semi" style={s.section}>Ringkasan Hari Ini</Txt>

      <View style={s.statsRow}>
        {[
          { icon: 'people-outline', value: '5', title: 'Pasien' },
          { icon: 'calendar-outline', value: `${slots.filter(x => x.active).length}`, title: 'Jadwal' },
          { icon: 'chatbubbles-outline', value: `${bookings.filter(x => x.status === 'Diproses').length}`, title: 'Aktif' },
        ].map((item) => (
          <View key={item.title} style={s.statCard}>
            <Icon name={item.icon as IconName} color={C.dark} />
            <Txt weight="bold" style={s.statNumber}>{item.value}</Txt>
            <Txt style={s.small}>{item.title}</Txt>
          </View>
        ))}
      </View>

      <Txt weight="semi" style={s.section}>Menu Utama</Txt>

      {[
        { label: 'Kelola Jadwal', desc: 'Atur waktu konsultasi', icon: 'calendar-outline', target: 'schedule' },
        { label: 'Permintaan Konsultasi', desc: 'Terima atau tolak booking', icon: 'people-outline', target: 'requests' },
        { label: 'Profil Psikiater', desc: 'Kelola data dan biaya layanan', icon: 'person-outline', target: 'profile' },
      ].map((item) => (
        <Pressable
          key={item.label}
          style={s.menuCard}
          onPress={() => setPage(item.target as Page)}
        >
          <View style={s.menuIcon}>
            <Icon name={item.icon as IconName} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt weight="semi">{item.label}</Txt>
            <Txt style={s.small}>{item.desc}</Txt>
          </View>
          <Icon name="chevron-forward" size={19} />
        </Pressable>
      ))}
    </ScrollView>
  );

  // HALAMAN 4 - KELOLA JADWAL
  const renderSchedule = () => (
    <>
      <Header title="Kelola Jadwal" onBack={() => setPage('dashboard')} />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.infoBox}>
          <Icon name="calendar-outline" />
          <Txt style={{ marginLeft: 10, flex: 1 }}>
            Atur ketersediaan waktu konsultasi Anda.
          </Txt>
        </View>

        <Txt weight="semi" style={s.section}>Jadwal Konsultasi</Txt>
        <Txt style={s.muted}>Contoh slot waktu untuk pengujian frontend.</Txt>

        <View style={{ height: 15 }} />

        {slots.map((slot, index) => (
          <Pressable
            key={slot.time}
            style={s.slotRow}
            onPress={() =>
              setSlots((old) =>
                old.map((x, i) =>
                  i === index ? { ...x, active: !x.active } : x
                )
              )
            }
          >
            <Icon
              name={slot.active ? 'checkbox' : 'square-outline'}
              color={slot.active ? C.pink : C.dark}
              size={25}
            />
            <Txt weight="medium" style={{ flex: 1, marginLeft: 12 }}>
              {slot.time}
            </Txt>
            <Txt style={s.small}>
              {slot.active ? 'Tersedia' : 'Nonaktif'}
            </Txt>
          </Pressable>
        ))}

        <View style={{ height: 20 }} />

        <Button
          title="+ Tambah Jadwal"
          onPress={() => {
            if (slots.some((x) => x.time === '16.00 - 16.30')) {
              Alert.alert('Info', 'Slot contoh sudah ditambahkan.');
            } else {
              setSlots((old) => [
                ...old,
                { time: '16.00 - 16.30', active: true },
              ]);
            }
          }}
        />
      </ScrollView>
    </>
  );

  // HALAMAN 5 - PERMINTAAN KONSULTASI
  const renderRequests = () => (
    <>
      <Header
        title="Permintaan Konsultasi"
        onBack={() => setPage('dashboard')}
      />
      <ScrollView contentContainerStyle={s.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          {(['Masuk', 'Diproses', 'Selesai', 'Ditolak'] as Status[]).map(
            (item) => (
              <Pressable
                key={item}
                onPress={() => setTab(item)}
                style={[s.tab, tab === item && s.tabActive]}
              >
                <Txt
                  weight="medium"
                  style={{ color: tab === item ? C.white : C.dark }}
                >
                  {item}
                </Txt>
              </Pressable>
            )
          )}
        </ScrollView>

        {bookings.filter((b) => b.status === tab).length === 0 && (
          <Txt style={s.empty}>Belum ada konsultasi di kategori ini.</Txt>
        )}

        {bookings
          .filter((b) => b.status === tab)
          .map((item) => (
            <Card key={item.id}>
              <View style={s.patientRow}>
                <View style={s.avatar}>
                  <Icon name="person-outline" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt weight="semi">{item.name}</Txt>
                  <Txt style={s.small}>{item.time} • {item.method}</Txt>
                </View>
              </View>

              <Txt style={[s.muted, { marginVertical: 13 }]}>
                {item.complaint}
              </Txt>

              <Button
                title="Lihat Detail"
                outline
                onPress={() => {
                  setSelectedId(item.id);
                  setPage('detail');
                }}
              />

              {item.status === 'Masuk' && (
                <View style={s.actionRow}>
                  <View style={{ flex: 1 }}>
                    <Button
                      title="Terima"
                      onPress={() => {
                        updateBooking(item.id, 'Diproses');
                        Alert.alert('Berhasil', 'Permintaan diterima (demo).');
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      title="Tolak"
                      outline
                      onPress={() => {
                        updateBooking(item.id, 'Ditolak');
                        Alert.alert('Info', 'Permintaan ditolak (demo).');
                      }}
                    />
                  </View>
                </View>
              )}
            </Card>
          ))}
      </ScrollView>
    </>
  );

  // HALAMAN 6 - DETAIL PASIEN
  const renderDetail = () => (
    <>
      <Header title="Detail Sesi" onBack={() => setPage('requests')} />
      <ScrollView contentContainerStyle={s.content}>
        <Card>
          <Txt weight="semi" style={s.section}>Informasi Pasien</Txt>
          <View style={s.patientRow}>
            <View style={s.avatarLarge}>
              <Icon name="person-outline" size={38} />
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Txt weight="semi" style={s.cardHeading}>
                {activeBooking.name}
              </Txt>
              <Txt style={s.small}>Pasien MindCare • Data demo</Txt>
            </View>
          </View>
        </Card>

        <Card>
          <Txt weight="semi" style={s.section}>Keluhan Utama</Txt>
          <View style={s.infoBox}>
            <Txt>{activeBooking.complaint}</Txt>
          </View>

          <Txt weight="semi" style={s.section}>Informasi Konsultasi</Txt>
          <Txt style={s.detailLine}>Waktu: {activeBooking.time}</Txt>
          <Txt style={s.detailLine}>Metode: {activeBooking.method}</Txt>
          <Txt style={s.detailLine}>Status: {activeBooking.status}</Txt>
        </Card>

        <Button
          title="Mulai Konsultasi"
          onPress={() => {
            if (activeBooking.status !== 'Diproses') {
              Alert.alert(
                'Belum Bisa Dimulai',
                'Terima permintaan konsultasi terlebih dahulu.'
              );
              return;
            }
            setMessages([
              {
                text: 'Selamat siang, Dok. Saya siap untuk konsultasi.',
                mine: false,
              },
              {
                text: 'Selamat siang. Silakan ceritakan kondisi Anda.',
                mine: true,
              },
            ]);
            setPage('chat');
          }}
        />
      </ScrollView>
    </>
  );

  // HALAMAN 7 - CHAT DAN PANGGILAN
  const renderChat = () => (
    <>
      <Header title={activeBooking.name} onBack={() => setPage('detail')} />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.chatContent}>
          <View style={s.infoBox}>
            <Icon name="lock-closed-outline" size={18} />
            <Txt style={[s.small, { flex: 1, marginLeft: 8 }]}>
              Sesi konsultasi demo. Jangan gunakan data pasien asli.
            </Txt>
          </View>

          {messages.map((msg, i) => (
            <View
              key={i}
              style={[
                s.bubble,
                msg.mine ? s.myBubble : s.theirBubble,
              ]}
            >
              <Txt>{msg.text}</Txt>
            </View>
          ))}
        </ScrollView>

        <View style={s.chatInputRow}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Ketik pesan..."
            placeholderTextColor="#A89DA0"
            style={[s.input, { flex: 1, marginBottom: 0 }]}
          />
          <Pressable onPress={sendMessage} style={s.sendButton}>
            <Icon name="send" color={C.white} size={20} />
          </Pressable>
        </View>

        <View style={s.callRow}>
          <Pressable
            onPress={() => showCallDemo('Telepon')}
            style={s.callButton}
          >
            <Icon name="call-outline" />
            <Txt weight="medium"> Telepon</Txt>
          </Pressable>

          <Pressable
            onPress={() => showCallDemo('Video Call')}
            style={s.callButton}
          >
            <Icon name="videocam-outline" />
            <Txt weight="medium"> Video Call</Txt>
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            Alert.alert('Selesaikan Sesi?', 'Akhiri sesi konsultasi demo ini?', [
              { text: 'Batal', style: 'cancel' },
              {
                text: 'Selesai',
                onPress: () => {
                  updateBooking(activeBooking.id, 'Selesai');
                  setTab('Selesai');
                  setPage('requests');
                },
              },
            ]);
          }}
          style={s.endSession}
        >
          <Txt weight="semi" style={{ color: C.white }}>
            Selesaikan Konsultasi
          </Txt>
        </Pressable>
      </View>
    </>
  );

  // HALAMAN 8 - PROFIL PSIKIATER
  const renderProfile = () => (
    <>
      <Header title="Profil Psikiater" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.profileTop}>
          <View style={s.avatarLarge}>
            <Icon name="person-outline" size={42} />
          </View>
          <Txt weight="bold" style={s.cardHeading}>{name}</Txt>
          <Txt style={s.muted}>{email || 'psikiater@mindcare.demo'}</Txt>
          <View style={s.statusBadge}>
            <Txt style={s.small}>Akun simulasi / belum diverifikasi</Txt>
          </View>
        </View>

        <Card>
          <Field
            label="Nama Lengkap"
            value={name}
            onChangeText={setName}
          />
          <Field
            label="Spesialisasi"
            value={specialty}
            onChangeText={setSpecialty}
          />
          <Field
            label="Biaya Konsultasi (Rp)"
            value={price}
            onChangeText={setPrice}
            numeric
          />

          <Button
            title="Simpan Perubahan"
            onPress={() =>
              Alert.alert('Berhasil', 'Profil demo berhasil diperbarui.')
            }
          />

          <View style={{ height: 12 }} />

          <Button
            title="Logout"
            outline
            onPress={() => setPage('login')}
          />
        </Card>
      </ScrollView>
    </>
  );

  const authPage = page === 'login' || page === 'register';
  const mainPage =
    page === 'dashboard' ||
    page === 'schedule' ||
    page === 'requests' ||
    page === 'profile';

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={{ flex: 1 }}>
        {page === 'login' && renderLogin()}
        {page === 'register' && renderRegister()}
        {page === 'dashboard' && renderDashboard()}
        {page === 'schedule' && renderSchedule()}
        {page === 'requests' && renderRequests()}
        {page === 'detail' && renderDetail()}
        {page === 'chat' && renderChat()}
        {page === 'profile' && renderProfile()}
      </View>

      {mainPage && (
        <View style={s.bottomNav}>
          {[
            { page: 'dashboard', icon: 'home-outline', text: 'Beranda' },
            { page: 'schedule', icon: 'calendar-outline', text: 'Jadwal' },
            { page: 'requests', icon: 'people-outline', text: 'Booking' },
            { page: 'profile', icon: 'person-outline', text: 'Profil' },
          ].map((item) => (
            <Pressable
              key={item.page}
              onPress={() => setPage(item.page as Page)}
              style={s.navItem}
            >
              <Icon
                name={item.icon as IconName}
                size={22}
                color={page === item.page ? '#AD6D7E' : C.muted}
              />
              <Txt
                weight="medium"
                style={[
                  s.navText,
                  page === item.page && { color: '#AD6D7E' },
                ]}
              >
                {item.text}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  authContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.peach,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  brand: {
    fontSize: 36,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    marginBottom: 28,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: C.border,
    elevation: 2,
    shadowColor: C.dark,
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardHeading: {
    fontSize: 17,
    marginBottom: 6,
  },
  muted: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 21,
  },
  label: {
    fontSize: 12,
    marginBottom: 7,
  },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: C.dark,
    marginBottom: 3,
  },
  button: {
    backgroundColor: C.pink,
    borderRadius: 14,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  buttonOutline: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.pink,
  },
  buttonText: {
    fontSize: 13,
  },
  authLink: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
    textDecorationLine: 'underline',
  },
  demoLabel: {
    marginTop: 25,
    fontSize: 10,
    color: C.muted,
  },
  header: {
    minHeight: 58,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  back: {
    marginRight: 14,
    padding: 5,
  },
  headerTitle: {
    fontSize: 17,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: C.peach,
    borderRadius: 16,
    marginBottom: 15,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 23,
    marginVertical: 5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.peach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.peach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: C.peach,
    marginBottom: 20,
  },
  section: {
    fontSize: 16,
    marginBottom: 14,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  statNumber: {
    fontSize: 23,
    marginTop: 9,
  },
  small: {
    fontSize: 11,
    color: C.muted,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    borderRadius: 17,
    marginBottom: 11,
    gap: 12,
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: C.peach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    borderRadius: 15,
    backgroundColor: C.white,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  tab: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    backgroundColor: C.peach,
    borderRadius: 20,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#B77789',
  },
  empty: {
    textAlign: 'center',
    marginTop: 45,
    color: C.muted,
    fontFamily: fonts.regular,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  detailLine: {
    fontSize: 13,
    marginBottom: 10,
  },
  chatContent: {
    padding: 15,
    flexGrow: 1,
  },
  bubble: {
    maxWidth: '83%',
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
  },
  myBubble: {
    backgroundColor: C.peach,
    alignSelf: 'flex-end',
  },
  theirBubble: {
    backgroundColor: C.white,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: C.border,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 10,
  },
  sendButton: {
    backgroundColor: '#B77789',
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
    marginVertical: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: C.white,
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endSession: {
    backgroundColor: '#B77789',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 12,
  },
  profileTop: {
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  statusBadge: {
    backgroundColor: C.peach,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginTop: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderColor: C.border,
    paddingTop: 11,
    paddingBottom: 9,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    color: C.muted,
  },
});
