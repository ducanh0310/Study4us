import { SubjectInfo, ResourceItem, MoleculePreset, AtomBohrPreset, Flashcard } from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'toan',
    name: 'Toán Học',
    shortName: 'Toán',
    icon: '📐',
    color: '#2563eb',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: 'blue',
    description: 'Đại số, Hình học, Giải tích & Vẽ đồ thị hàm số',
  },
  {
    id: 'ly',
    name: 'Vật Lý',
    shortName: 'Lý',
    icon: '⚡',
    color: '#0891b2',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    accentColor: 'cyan',
    description: 'Cơ học, Dao động điều hòa, Sóng & Điện xoay chiều',
  },
  {
    id: 'hoa',
    name: 'Hóa Học',
    shortName: 'Hóa',
    icon: '🧪',
    color: '#16a34a',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: 'emerald',
    description: 'Nguyên tử, Liên kết hóa học & Mô hình phân tử 3D',
  },
  {
    id: 'anh',
    name: 'Tiếng Anh',
    shortName: 'Tiếng Anh',
    icon: '🌐',
    color: '#9333ea',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    accentColor: 'purple',
    description: 'Ngữ pháp 12 thì, Từ vựng theo chủ đề & Phát âm chuẩn',
  },
];

export const GRADES = [
  { id: 8 as const, name: 'Lớp 8', level: 'THCS' },
  { id: 9 as const, name: 'Lớp 9', level: 'THCS - Ôn thi vào 10' },
  { id: 10 as const, name: 'Lớp 10', level: 'THPT' },
  { id: 11 as const, name: 'Lớp 11', level: 'THPT' },
  { id: 12 as const, name: 'Lớp 12', level: 'THPT - Luyện thi TN & ĐGNL' },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  // ================= TOÁN HỌC =================
  {
    id: 'toan-8-1',
    subjectId: 'toan',
    gradeId: 8,
    chapter: 'Chương 1: Đa thức & Hằng đẳng thức đáng nhớ',
    title: '7 Hằng đẳng thức đáng nhớ & Phân tích đa thức',
    type: 'theory',
    summary: 'Tổng hợp 7 hằng đẳng thức cốt lõi, phương pháp nhóm hạng tử và đặt nhân tử chung.',
    content: `### 1. 7 Hằng đẳng thức đáng nhớ
1. Bình phương của một tổng: $(A + B)^2 = A^2 + 2AB + B^2$
2. Bình phương của một hiệu: $(A - B)^2 = A^2 - 2AB + B^2$
3. Hiệu hai bình phương: $A^2 - B^2 = (A - B)(A + B)$
4. Lập phương của một tổng: $(A + B)^3 = A^3 + 3A^2B + 3AB^2 + B^3$
5. Lập phương của một hiệu: $(A - B)^3 = A^3 - 3A^2B + 3AB^2 - B^3$
6. Tổng hai lập phương: $A^3 + B^3 = (A + B)(A^2 - AB + B^2)$
7. Hiệu hai lập phương: $A^3 - B^3 = (A - B)(A^2 + AB + B^2)$

### 2. Lưu ý gia sư khi dạy học sinh lớp 8:
- Thường xuyên nhầm lẫn dấu giữa $(A - B)^3$ và $A^3 - B^3$.
- Kỹ thuật đổi dấu: $(B - A)^2 = (A - B)^2$, nhưng $(B - A)^3 = -(A - B)^3$.`,
    latexFormula: '(A + B)^2 = A^2 + 2AB + B^2',
    tags: ['Đại số 8', 'Hằng đẳng thức', 'Cốt lõi'],
    tutorNote: 'Cho học sinh làm ngay 5 bài biến đổi thuận và 5 bài biến đổi nghịch trong 10 phút đầu buổi.',
    updatedAt: '2026-11-10',
  },
  {
    id: 'toan-9-1',
    subjectId: 'toan',
    gradeId: 9,
    chapter: 'Chương 4: Hàm số y = ax² & Phương trình bậc hai',
    title: 'Khảo sát đồ thị Parabol y = ax² & Tương giao Parabol - Đường thẳng',
    type: 'theory',
    summary: 'Đặc điểm đồ thị Parabol đỉnh O(0,0), trục đối xứng Oy và bài toán tìm tọa độ giao điểm với d: y = mx + n.',
    content: `### 1. Tính chất của hàm số $y = ax^2 (a \\neq 0)$
- Nếu $a > 0$: Hàm số nghịch biến khi $x < 0$, đồng biến khi $x > 0$. Đồ thị quay bề lõm lên trên, đỉnh $O(0,0)$ là điểm thấp nhất.
- Nếu $a < 0$: Hàm số đồng biến khi $x < 0$, nghịch biến khi $x > 0$. Đồ thị quay bề lõm xuống dưới, đỉnh $O(0,0)$ là điểm cao nhất.

### 2. Sự tương giao giữa (P): $y = ax^2$ và (d): $y = mx + n$
Phương trình hoành độ giao điểm:
$$ax^2 - mx - n = 0$$
- $\\Delta > 0$: (d) cắt (P) tại 2 điểm phân biệt.
- $\\Delta = 0$: (d) tiếp xúc với (P) tại 1 điểm duy nhất (tiếp điểm).
- $\\Delta < 0$: (d) không cắt (P).`,
    latexFormula: 'y = a x^2',
    tags: ['Toán 9', 'Parabol', 'Ôn thi vào 10', 'Tương giao'],
    relatedTool: {
      toolType: 'graph',
      initialConfig: { expr: 'x^2 - 2*x - 3', title: 'Parabol y = x^2 - 2x - 3' },
    },
    sampleProblems: [
      {
        question: 'Tìm tọa độ giao điểm của Parabol (P): y = x^2 và đường thẳng (d): y = 2x + 3.',
        options: ['A. (3; 9) và (-1; 1)', 'B. (2; 4) và (-1; 1)', 'C. (1; 1) và (-3; 9)', 'D. (3; 9) và (1; 1)'],
        correctAnswer: 'A. (3; 9) và (-1; 1)',
        explanation: 'Phương trình hoành độ: x^2 - 2x - 3 = 0 <=> (x - 3)(x + 1) = 0 => x = 3 => y = 9; x = -1 => y = 1.',
      },
    ],
    updatedAt: '2026-11-11',
  },
  {
    id: 'toan-10-1',
    subjectId: 'toan',
    gradeId: 10,
    chapter: 'Chương 3: Hàm số bậc hai & Dấu của tam thức',
    title: 'Hàm số bậc hai y = ax² + bx + c & Tọa độ đỉnh',
    type: 'formula',
    summary: 'Tọa độ đỉnh I(-b/2a, -Δ/4a), trục đối xứng x = -b/2a và bảng biến thiên.',
    content: `### 1. Công thức trọng tâm
- Tọa độ đỉnh: $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$
- Trục đối xứng: đường thẳng $x = -\\frac{b}{2a}$
- Bề lõm: $a > 0$ hướng lên (min tại I), $a < 0$ hướng xuống (max tại I).

### 2. Định lý về dấu của tam thức bậc hai $f(x) = ax^2 + bx + c$
- $\\Delta < 0$: $f(x)$ cùng dấu với hệ số $a$ với mọi $x \\in \\mathbb{R}$.
- $\\Delta = 0$: $f(x)$ cùng dấu với hệ số $a$ với mọi $x \\neq -\\frac{b}{2a}$.
- $\\Delta > 0$: "Trong trái, ngoài cùng" (trong khoảng 2 nghiệm trái dấu $a$, ngoài khoảng cùng dấu $a$).`,
    latexFormula: 'y = a x^2 + b x + c \\quad (I: -\\frac{b}{2a}, -\\frac{\\Delta}{4a})',
    tags: ['Toán 10', 'Tam thức bậc 2', 'Bảng biến thiên'],
    relatedTool: {
      toolType: 'graph',
      initialConfig: { expr: 'x^2 - 4*x + 3', title: 'Hàm số bậc 2: y = x^2 - 4x + 3' },
    },
    updatedAt: '2026-11-11',
  },
  {
    id: 'toan-11-1',
    subjectId: 'toan',
    gradeId: 11,
    chapter: 'Chương 1: Hàm số lượng giác & Phương trình lượng giác',
    title: 'Đồ thị và tính tuần hoàn của y = sin(x), y = cos(x), y = tan(x)',
    type: 'theory',
    summary: 'Chu kỳ tuần hoàn T = 2π (sin, cos) và T = π (tan, cot). Tập xác định, tập giá trị và tính chẵn lẻ.',
    content: `### 1. Hàm số $y = \\sin(x)$
- Tập xác định: $D = \\mathbb{R}$, Tập giá trị: $[-1; 1]$.
- Hàm số lẻ: $\\sin(-x) = -\\sin(x)$, đồ thị đối xứng qua gốc tọa độ O.
- Tuần hoàn với chu kỳ $T = 2\\pi$.

### 2. Hàm số $y = \\cos(x)$
- Tập xác định: $D = \\mathbb{R}$, Tập giá trị: $[-1; 1]$.
- Hàm số chẵn: $\\cos(-x) = \\cos(x)$, đồ thị đối xứng qua trục tung Oy.
- Tuần hoàn với chu kỳ $T = 2\\pi$.`,
    latexFormula: 'y = \\sin(x), \\quad T = 2\\pi',
    tags: ['Toán 11', 'Lượng giác', 'Đồ thị hình sin'],
    relatedTool: {
      toolType: 'graph',
      initialConfig: { expr: 'sin(x)', title: 'Đồ thị hàm số y = sin(x)' },
    },
    updatedAt: '2026-11-09',
  },
  {
    id: 'toan-12-1',
    subjectId: 'toan',
    gradeId: 12,
    chapter: 'Chương 1: Ứng dụng đạo hàm để khảo sát hàm số',
    title: 'Cực trị, Đồ thị hàm bậc 3 và Tiệm cận phân thức bậc nhất',
    type: 'theory',
    summary: 'Quy tắc xét dấu y\', tìm cực đại, cực tiểu, tiệm cận đứng x = -d/c và tiệm cận ngang y = a/c.',
    content: `### 1. Hàm bậc 3: $y = ax^3 + bx^2 + cx + d (a \\neq 0)$
- Đạo hàm: $y' = 3ax^2 + 2bx + c$.
- $\\Delta_{y'} > 0$: Hàm số có 2 điểm cực trị ($x_{CĐ}, x_{CT}$).
- $\\Delta_{y'} \\le 0$: Hàm số đơn điệu trên $\\mathbb{R}$, không có cực trị.
- Tâm đối xứng của đồ thị: Điểm uốn $U(x_0; y_0)$ với $y''(x_0) = 0 \\implies x_0 = -\\frac{b}{3a}$.

### 2. Hàm phân thức hữu tỉ $y = \\frac{ax + b}{cx + d} (ad - bc \\neq 0, c \\neq 0)$
- Tiệm cận đứng: $x = -\\frac{d}{c}$
- Tiệm cận ngang: $y = \\frac{a}{c}$
- Giao điểm 2 đường tiệm cận $I\\left(-\\frac{d}{c}; \\frac{a}{c}\\right)$ là tâm đối xứng của Hyperbol.`,
    latexFormula: 'y = \\frac{ax + b}{cx + d} \\implies TCĐ: x = -\\frac{d}{c}, \\quad TCN: y = \\frac{a}{c}',
    tags: ['Toán 12', 'Khảo sát hàm số', 'Thi tốt nghiệp THPT', 'Tiệm cận'],
    relatedTool: {
      toolType: 'graph',
      initialConfig: { expr: 'x^3 - 3*x', title: 'Hàm số bậc 3 y = x^3 - 3x' },
    },
    updatedAt: '2026-11-12',
  },

  // ================= VẬT LÝ =================
  {
    id: 'ly-8-1',
    subjectId: 'ly',
    gradeId: 8,
    chapter: 'Chương 1: Cơ học',
    title: 'Vận tốc, Chuyển động đều và Chuyển động không đều',
    type: 'theory',
    summary: 'Công thức v = s / t, vận tốc trung bình v_tb = (s1 + s2)/(t1 + t2), quán tính và lực ma sát.',
    content: `### 1. Chuyển động cơ học & Vận tốc
- Vận tốc biểu thị mức độ nhanh chậm của chuyển động:
$$v = \\frac{s}{t}$$
- Đơn vị hợp pháp: $m/s$ hoặc $km/h$ (Quy đổi: $1 m/s = 3.6 km/h$).
- Vận tốc trung bình trong chuyển động không đều:
$$v_{tb} = \\frac{s_1 + s_2 + ... + s_n}{t_1 + t_2 + ... + t_n}$$
*Lưu ý: Không lấy trung bình cộng hai vận tốc!*`,
    latexFormula: 'v = \\frac{s}{t}, \\quad v_{tb} = \\frac{s_1 + s_2}{t_1 + t_2}',
    tags: ['Vật lý 8', 'Cơ học', 'Vận tốc'],
    updatedAt: '2026-11-08',
  },
  {
    id: 'ly-9-1',
    subjectId: 'ly',
    gradeId: 9,
    chapter: 'Chương 1: Điện học & Định luật Ôm',
    title: 'Định luật Ôm cho đoạn mạch & Điện trở dây dẫn',
    type: 'formula',
    summary: 'Hệ thức I = U / R, điện trở phụ thuộc vật liệu, chiều dài và tiết diện dây dẫn R = ρ * l / S.',
    content: `### 1. Định luật Ôm
Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và tỉ lệ nghịch với điện trở của dây:
$$I = \\frac{U}{R}$$
- $I$: Cường độ dòng điện (A)
- $U$: Hiệu điện thế (V)
- $R$: Điện trở ($\\Omega$)

### 2. Mạch nối tiếp và Song song
- Đoạn mạch nối tiếp: $I = I_1 = I_2$, $U = U_1 + U_2$, $R_{td} = R_1 + R_2$.
- Đoạn mạch song song: $U = U_1 = U_2$, $I = I_1 + I_2$, $\\frac{1}{R_{td}} = \\frac{1}{R_1} + \\frac{1}{R_2}$.`,
    latexFormula: 'I = \\frac{U}{R}, \\quad R = \\rho \\frac{l}{S}',
    tags: ['Vật lý 9', 'Điện học', 'Định luật Ôm'],
    updatedAt: '2026-11-09',
  },
  {
    id: 'ly-10-1',
    subjectId: 'ly',
    gradeId: 10,
    chapter: 'Chương 3: Động lực học & Chuyển động ném',
    title: 'Chuyển động ném xiên và ném ngang trong trọng trường',
    type: 'theory',
    summary: 'Phân tích chuyển động ném xiên theo 2 trục Ox (chuyển động thẳng đều) và Oy (chuyển động biến đổi đều gia tốc g).',
    content: `### 1. Phân tích chuyển động ném xiên với góc $\\alpha$
Chọn hệ trục toạ độ $Oxy$ gốc tại vị trí ném:
- Theo phương ngang $Ox$: Gia tốc $a_x = 0 \\implies v_x = v_0 \\cos\\alpha$
  Phương trình toạ độ: $x = (v_0 \\cos\\alpha) t$
- Theo phương thẳng đứng $Oy$: Gia tốc $a_y = -g \\implies v_y = v_0 \\sin\\alpha - gt$
  Phương trình toạ độ: $y = (v_0 \\sin\\alpha) t - \\frac{1}{2}gt^2$

### 2. Các đại lượng đặc trưng
- Thời gian vật lên đến đỉnh cao nhất: $t_{max} = \\frac{v_0 \\sin\\alpha}{g}$
- Tầm cao cực đại: $H = \\frac{v_0^2 \\sin^2\\alpha}{2g}$
- Tầm bay xa: $L = \\frac{v_0^2 \\sin(2\\alpha)}{g}$ (Đạt cực đại khi $\\alpha = 45^\\circ$).`,
    latexFormula: 'L = \\frac{v_0^2 \\sin(2\\alpha)}{g}, \\quad H = \\frac{v_0^2 \\sin^2\\alpha}{2g}',
    tags: ['Vật lý 10', 'Ném xiên', 'Mô phỏng quỹ đạo'],
    relatedTool: {
      toolType: 'physics',
      initialConfig: { mode: 'projectile', v0: 20, angle: 45 },
    },
    updatedAt: '2026-11-10',
  },
  {
    id: 'ly-11-1',
    subjectId: 'ly',
    gradeId: 11,
    chapter: 'Chương 1: Dao động cơ',
    title: 'Dao động điều hòa & Mối liên hệ Véc-tơ quay Fresnel',
    type: 'theory',
    summary: 'Phương trình x = A cos(ωt + φ), chu kỳ T, tần số f, năng lượng dao động và đường tròn lượng giác.',
    content: `### 1. Phương trình dao động điều hòa
- Li độ: $x = A \\cos(\\omega t + \\varphi)$
- Vận tốc: $v = x' = -\\omega A \\sin(\\omega t + \\varphi) = \\omega A \\cos(\\omega t + \\varphi + \\frac{\\pi}{2})$
  *Vận tốc sớm pha $\\frac{\\pi}{2}$ so với li độ, $v_{max} = \\omega A$ tại vị trí cân bằng.*
- Gia tốc: $a = v' = -\\omega^2 x = \\omega^2 A \\cos(\\omega t + \\varphi + \\pi)$
  *Gia tốc sớm pha $\\pi$ (ngược pha) so với li độ, luôn hướng về vị trí cân bằng.*

### 2. Năng lượng dao động
- Động năng: $W_d = \\frac{1}{2} m v^2$
- Thế năng: $W_t = \\frac{1}{2} k x^2 = \\frac{1}{2} m \\omega^2 x^2$
- Cơ năng: $W = W_d + W_t = \\frac{1}{2} k A^2 = \\frac{1}{2} m \\omega^2 A^2 = \\text{const}$.`,
    latexFormula: 'x = A \\cos(\\omega t + \\varphi), \\quad W = \\frac{1}{2} k A^2',
    tags: ['Vật lý 11', 'Dao động điều hòa', 'Véc-tơ Fresnel'],
    relatedTool: {
      toolType: 'physics',
      initialConfig: { mode: 'spring', k: 100, m: 1, A: 0.1 },
    },
    updatedAt: '2026-11-11',
  },
  {
    id: 'ly-12-1',
    subjectId: 'ly',
    gradeId: 12,
    chapter: 'Chương 1: Dao động cơ & Con lắc đơn, Con lắc lò xo',
    title: 'Con lắc lò xo, Con lắc đơn & Bài toán năng lượng',
    type: 'theory',
    summary: 'Chu kỳ con lắc đơn T = 2π√(l/g), con lắc lò xo T = 2π√(m/k), tổng hợp dao động và hiện tượng cộng hưởng.',
    content: `### 1. Con lắc lò xo
- Tần số góc: $\\omega = \\sqrt{\\frac{k}{m}}$
- Chu kỳ: $T = 2\\pi \\sqrt{\\frac{m}{k}}$

### 2. Con lắc đơn
- Tần số góc: $\\omega = \\sqrt{\\frac{g}{l}}$
- Chu kỳ: $T = 2\\pi \\sqrt{\\frac{l}{g}}$ (không phụ thuộc vào khối lượng quả cầu $m$).
- Lực căng dây treo: $T_c = mg(3\\cos\\alpha - 2\\cos\\alpha_0)$.
  *Lực căng cực đại tại VTCB: $T_{c,max} = mg(3 - 2\\cos\\alpha_0)$.*`,
    latexFormula: 'T_{clx} = 2\\pi \\sqrt{\\frac{m}{k}}, \\quad T_{cld} = 2\\pi \\sqrt{\\frac{l}{g}}',
    tags: ['Vật lý 12', 'Con lắc đơn', 'Con lắc lò xo', 'Luyện thi TN'],
    relatedTool: {
      toolType: 'physics',
      initialConfig: { mode: 'pendulum', l: 1, alpha0: 15 },
    },
    updatedAt: '2026-11-12',
  },

  // ================= HÓA HỌC =================
  {
    id: 'hoa-8-1',
    subjectId: 'hoa',
    gradeId: 8,
    chapter: 'Chương 1: Chất - Nguyên tử - Phân tử',
    title: 'Cấu tạo nguyên tử & Phân tử đơn chất, hợp chất',
    type: 'theory',
    summary: 'Hạt nhân mang điện dương gồm proton (p) và neutron (n), lớp vỏ electron (e) mang điện tích âm quay xung quanh.',
    content: `### 1. Cấu tạo nguyên tử
- Nguyên tử là hạt vô cùng nhỏ và trung hòa về điện.
- Hạt nhân: ở tâm nguyên tử, gồm các hạt proton mang điện tích $+1$ và hạt neutron không mang điện.
- Vỏ nguyên tử: gồm các electron mang điện tích $-1$ chuyển động rất nhanh quanh hạt nhân.
- Vì nguyên tử trung hòa về điện nên: Số proton ($p$) = Số electron ($e$).

### 2. Đơn chất và Hợp chất
- Đơn chất: Tạo nên từ 1 nguyên tố hóa học (VD: Khí Hiđro $H_2$, Khí Oxi $O_2$, Kim loại Sắt $Fe$).
- Hợp chất: Tạo nên từ 2 hay nhiều nguyên tố hóa học (VD: Nước $H_2O$, Khí cacbonic $CO_2$, Muối ăn $NaCl$).`,
    latexFormula: 'p = e = Z',
    tags: ['Hóa 8', 'Nguyên tử', 'Hạt nhân'],
    relatedTool: {
      toolType: 'chemistry',
      initialConfig: { atomZ: 6, mode: 'bohr' }, // Carbon Bohr model
    },
    updatedAt: '2026-11-09',
  },
  {
    id: 'hoa-9-1',
    subjectId: 'hoa',
    gradeId: 9,
    chapter: 'Chương 4: Hiđrocacbon - Nhiên liệu',
    title: 'Metan (CH₄) & Etilen (C₂H₄) - Cấu tạo phân tử & Phản ứng đặc trưng',
    type: 'theory',
    summary: 'Cấu trúc tứ diện của CH4 (liên kết đơn bền vững, phản ứng thế) và cấu trúc phẳng của C2H4 (liên kết đôi C=C kém bền, phản ứng cộng).',
    content: `### 1. Metan ($CH_4$)
- Công thức cấu tạo: Nguyên tử Cacbon ở tâm tứ diện đều, liên kết với 4 nguyên tử Hiđro bằng 4 liên kết đơn $C-H$. Góc liên kết xấp xỉ $109.5^\\circ$.
- Tính chất hóa học đặc trưng: Phản ứng thế với Clo khi có ánh sáng khuếch tán:
$$CH_4 + Cl_2 \\xrightarrow{as} CH_3Cl + HCl$$

### 2. Etilen ($C_2H_4$)
- Công thức cấu tạo: $CH_2 = CH_2$. Trong phân tử có một liên kết đôi giữa hai nguyên tử cacbon.
- Liên kết đôi gồm 1 liên kết $\\sigma$ bền và 1 liên kết $\\pi$ kém bền dễ bị đứt gãy.
- Phản ứng đặc trưng: Phản ứng cộng (làm mất màu dung dịch Brom $Br_2$):
$$CH_2 = CH_2 + Br_2 \\rightarrow CH_2Br - CH_2Br$$`,
    latexFormula: 'CH_2=CH_2 + Br_2 \\rightarrow CH_2Br-CH_2Br',
    tags: ['Hóa 9', 'Hiđrocacbon', 'Metan', 'Etilen', 'Mô hình 3D'],
    relatedTool: {
      toolType: 'chemistry',
      initialConfig: { moleculeId: 'c2h4' },
    },
    updatedAt: '2026-11-10',
  },
  {
    id: 'hoa-10-1',
    subjectId: 'hoa',
    gradeId: 10,
    chapter: 'Chương 3: Liên kết hóa học & Cấu trúc phân tử',
    title: 'Liên kết cộng hóa trị, Mô hình VSEPR & Hình học phân tử',
    type: 'theory',
    summary: 'Dự đoán dạng hình học phân tử theo thuyết VSEPR: H2O (góc 104.5°), NH3 (chóp tam giác 107°), CO2 (đường thẳng 180°), CH4 (tứ diện 109.5°).',
    content: `### 1. Thuyết lực đẩy các cặp electron vỏ hóa trị (VSEPR)
Các cặp electron hóa trị (bao gồm cặp electron liên kết và cặp electron chưa liên kết) xung quanh nguyên tử trung tâm đẩy nhau, sắp xếp sao cho khoảng cách giữa chúng là xa nhất để năng lượng tương tác đẩy là nhỏ nhất.

### 2. Dạng hình học các phân tử kinh điển:
- $CO_2$: Dạng đường thẳng ($180^\\circ$) do không còn cặp electron tự do trên C.
- $H_2O$: Dạng gấp khúc ($104.5^\\circ$) do 2 cặp e tự do của Oxi đẩy mạnh 2 liên kết $O-H$.
- $NH_3$: Dạng chóp tam giác ($107^\\circ$) do 1 cặp e tự do trên Nitơ.
- $CH_4$: Dạng tứ diện đều ($109.5^\\circ$).`,
    latexFormula: '\\text{Góc liên kết } H_2O: 104.5^\\circ, \\quad CO_2: 180^\\circ',
    tags: ['Hóa 10', 'VSEPR', 'Hình học phân tử', 'Liên kết hóa học'],
    relatedTool: {
      toolType: 'chemistry',
      initialConfig: { moleculeId: 'h2o' },
    },
    updatedAt: '2026-11-11',
  },
  {
    id: 'hoa-11-1',
    subjectId: 'hoa',
    gradeId: 11,
    chapter: 'Chương 5: Hiđrocacbon thơm & Dẫn xuất Halogen - Ancol',
    title: 'Vòng thơm Benzen (C₆H₆) & Ancol Etylic (C₂H₅OH)',
    type: 'theory',
    summary: 'Cấu trúc vòng 6 cạnh phẳng liên hợp bền vững của Benzen và nhóm chức hydroxyl -OH của Ancol tạo liên kết hiđro liên phân tử.',
    content: `### 1. Cấu trúc vòng Benzen ($C_6H_6$)
- 6 nguyên tử Cacbon ở trạng thái lai hóa $sp^2$ liên kết với nhau tạo thành một lục giác đều phẳng.
- 6 electron $p$ chưa lai hóa xen phủ bên tạo thành hệ thống liên hợp $\\pi$ kín phân bố đều trên toàn vòng.
- Tính chất "Dễ thế, khó cộng, bền với tác nhân oxy hóa".

### 2. Ancol Etylic ($C_2H_5OH$)
- Nhóm chức $-OH$ phân cực mạnh.
- Giữa các phân tử ancol có liên kết hiđro liên phân tử, giải thích vì sao cồn $C_2H_5OH$ có nhiệt độ sôi cao hơn hẳn hiđrocacbon cùng khối lượng mol.`,
    latexFormula: 'C_6H_6, \\quad C_2H_5OH',
    tags: ['Hóa 11', 'Benzen', 'Ancol', 'Vòng thơm 3D'],
    relatedTool: {
      toolType: 'chemistry',
      initialConfig: { moleculeId: 'c6h6' },
    },
    updatedAt: '2026-11-12',
  },
  {
    id: 'hoa-12-1',
    subjectId: 'hoa',
    gradeId: 12,
    chapter: 'Chương 1: Este - Lipit & Cacbohiđrat',
    title: 'Phản ứng xà phòng hóa Este & Cấu trúc Glucose (C₆H₁₂O₆)',
    type: 'theory',
    summary: 'Cơ chế thủy phân este trong môi trường kiềm (một chiều) và cấu trúc mạch hở / mạch vòng của monosaccarit Glucose.',
    content: `### 1. Phản ứng thủy phân Este trong môi trường kiềm (Xà phòng hóa)
$$RCOOR' + NaOH \\xrightarrow{t^\\circ} RCOONa + R'OH$$
- Phản ứng xảy ra một chiều và hoàn toàn khi đun nóng.

### 2. Cấu trúc phân tử Glucose ($C_6H_{12}O_6$)
- Ở dạng mạch hở: Là hợp chất hữu cơ tạp chức, có cấu tạo của anđehit đơn chức và ancol 5 chức ($CH_2OH-[CHOH]_4-CHO$).
- Trong dung dịch: Glucose tồn tại chủ yếu ở dạng vòng 6 cạnh ($\alpha$-glucose và $\beta$-glucose).
- Tác dụng với $Cu(OH)_2$ ở nhiệt độ thường tạo dung dịch màu xanh lam (tính chất poliancol).
- Tráng bạc với thuốc thử Tollens: Tạo 2 mol $Ag$ kết tủa sáng bóng.`,
    latexFormula: 'CH_2OH(CHOH)_4CHO + 2AgNO_3 + 3NH_3 + H_2O \\rightarrow 2Ag \\downarrow',
    tags: ['Hóa 12', 'Este', 'Glucose', 'Ôn thi THPT Quốc Gia'],
    relatedTool: {
      toolType: 'chemistry',
      initialConfig: { moleculeId: 'glucose' },
    },
    updatedAt: '2026-11-12',
  },

  // ================= TIẾNG ANH =================
  {
    id: 'anh-8-1',
    subjectId: 'anh',
    gradeId: 8,
    chapter: 'Unit 1: Life in the Countryside & Leisure Activities',
    title: 'Comparative of Adverbs & Verbs of Liking / Disliking',
    type: 'theory',
    summary: 'So sánh hơn của trạng từ (more quickly, harder) và động từ chỉ sở thích đi kèm V-ing / to V.',
    content: `### 1. Comparative of Adverbs (So sánh hơn của trạng từ)
- Trạng từ ngắn (1 âm tiết, cùng dạng tính từ: fast, hard, late, early):
$$\\text{adv} + -er + \\text{than} \\quad (\\text{VD: harder than, faster than})$$
- Trạng từ dài (tận cùng -ly: quickly, carefully, beautifully):
$$\\text{more} + \\text{adv} + \\text{than} \\quad (\\text{VD: more carefully than})$$

### 2. Verbs of liking / disliking + V-ing
- Adore, enjoy, love, like, fancy, prefer + V-ing
- Detest, dislike, hate + V-ing
- *Ví dụ:* He prefers riding a buffalo to driving a tractor.`,
    latexFormula: 'S_1 + V + \\text{more/adv-er} + \\text{than} + S_2',
    tags: ['Tiếng Anh 8', 'Comparative', 'Adverbs'],
    relatedTool: {
      toolType: 'english',
      initialConfig: { grade: 8 },
    },
    updatedAt: '2026-11-09',
  },
  {
    id: 'anh-9-1',
    subjectId: 'anh',
    gradeId: 9,
    chapter: 'Unit 9: English in the World & Conditional Sentences',
    title: 'Conditional Sentences Type 1 & Type 2 (Câu điều kiện loại 1 & 2)',
    type: 'formula',
    summary: 'Cấu trúc câu điều kiện có thể xảy ra ở hiện tại/tương lai (Loại 1) và giả định trái ngược với hiện tại (Loại 2).',
    content: `### 1. Type 1: Real in the present/future (Có thật)
- Mệnh đề If: Hiện tại đơn ($S + V(s/es)$)
- Mệnh đề chính: $S + will/can/may + V_{bare}$
- *Ví dụ:* If it rains tomorrow, we will postpone our camping trip.

### 2. Type 2: Unreal in the present (Không có thật ở hiện tại)
- Mệnh đề If: Quá khứ đơn ($S + V_2/ed$, to-be chia 'were' cho tất cả các ngôi)
- Mệnh đề chính: $S + would/could/might + V_{bare}$
- *Ví dụ:* If I were you, I would practice speaking English every day.`,
    latexFormula: '\\text{If } S + V_{ed/2}, \\quad S + would + V_{inf}',
    tags: ['Tiếng Anh 9', 'Conditionals', 'Ôn thi vào 10'],
    relatedTool: {
      toolType: 'english',
      initialConfig: { grade: 9 },
    },
    updatedAt: '2026-11-10',
  },
  {
    id: 'anh-10-1',
    subjectId: 'anh',
    gradeId: 10,
    chapter: 'Unit 3: Music & Relative Clauses',
    title: 'Mệnh đề quan hệ (Relative Clauses) - Who, Whom, Which, That, Whose',
    type: 'theory',
    summary: 'Phân biệt mệnh đề quan hệ xác định (defining) và không xác định (non-defining), đại từ quan hệ và trạng từ quan hệ.',
    content: `### 1. Bảng đại từ quan hệ
- **Who**: Thay thế cho danh từ chỉ người làm chủ ngữ ($S$).
- **Whom**: Thay thế cho danh từ chỉ người làm tân ngữ ($O$).
- **Which**: Thay thế cho danh từ chỉ vật làm chủ ngữ hoặc tân ngữ.
- **That**: Dùng cho cả người và vật trong mệnh đề xác định (không dùng sau dấu phẩy và giới từ).
- **Whose**: Chỉ sự sở hữu của cả người và vật ($whose + N$).

### 2. Mệnh đề quan hệ không xác định (Có dấu phẩy)
- Dùng để bổ sung thêm thông tin cho một danh từ đã được xác định cụ thể (tên riêng, có this/that/my...).
- *Ví dụ:* My English teacher, who lived in London for 5 years, has an authentic British accent.`,
    latexFormula: 'N(\\text{person}) + who + V \\dots, \\quad N(\\text{thing}) + which + V \\dots',
    tags: ['Tiếng Anh 10', 'Relative Clauses', 'Ngữ pháp'],
    relatedTool: {
      toolType: 'english',
      initialConfig: { grade: 10 },
    },
    updatedAt: '2026-11-11',
  },
  {
    id: 'anh-11-1',
    subjectId: 'anh',
    gradeId: 11,
    chapter: 'Unit 2: The Generation Gap & Modal Verbs',
    title: 'Modal Verbs: Must, Have to, Should, Ought to (Động từ khuyết thiếu)',
    type: 'formula',
    summary: 'Phân biệt Must (bắt buộc từ người nói) vs Have to (bắt buộc do quy định khách quan), Should/Ought to (lời khuyên).',
    content: `### 1. Bắt buộc (Obligation)
- **Must**: Bắt buộc xuất phát từ cảm xúc hoặc mệnh lệnh của người nói.
  *Phủ định: Mustn't = Cấm đoán không được phép làm.*
- **Have to**: Bắt buộc do luật lệ, hoàn cảnh khách quan hoặc nội quy.
  *Phủ định: Don't have to = Không cần thiết phải làm.*

### 2. Lời khuyên (Advice)
- **Should / Ought to + V**: Nên làm gì đó.
- **Should have + V3/ed**: Lẽ ra nên làm gì trong quá khứ (nhưng đã không làm).`,
    latexFormula: 'Must \\neq Have\\ to, \\quad Mustn\'t \\neq Don\'t\\ have\\ to',
    tags: ['Tiếng Anh 11', 'Modal Verbs', 'Generation Gap'],
    relatedTool: {
      toolType: 'english',
      initialConfig: { grade: 11 },
    },
    updatedAt: '2026-11-11',
  },
  {
    id: 'anh-12-1',
    subjectId: 'anh',
    gradeId: 12,
    chapter: 'Chuyên đề: Đảo ngữ & Câu giả định (Inversion & Subjunctive)',
    title: 'Đảo ngữ toàn diện (Inversion) & Câu chẻ (Cleft Sentences)',
    type: 'theory',
    summary: 'Công thức đảo ngữ với phó từ phủ định (Never, Rarely, Seldom, Not only), No sooner... than, và Only when.',
    content: `### 1. Đảo ngữ với phó từ phủ định đứng đầu câu
$$\\text{Negative Word} + \\text{Auxiliary} + S + V$$
- *Never in my life have I seen such a beautiful landscape.*
- *Rarely does she arrive late for class.*

### 2. Các cấu trúc đảo ngữ đặc biệt thi THPT Quốc Gia
- **No sooner + had + S + V3/ed + than + S + V2/ed** (Vừa mới... thì...)
- **Hardly / Scarcely + had + S + V3/ed + when + S + V2/ed**
- **Not only + trợ động từ + S + V + but also + S + V**
- **Only by + V-ing + trợ động từ + S + V** (Chỉ bằng cách...)`,
    latexFormula: 'No\\ sooner + had + S + V_{pII} + than + S + V_{past}',
    tags: ['Tiếng Anh 12', 'Inversion', 'Đảo ngữ', 'Luyện thi THPT'],
    relatedTool: {
      toolType: 'english',
      initialConfig: { grade: 12 },
    },
    updatedAt: '2026-11-12',
  },
  {
    id: 'toan-10-2',
    subjectId: 'toan',
    gradeId: 10,
    chapter: 'Chương 4: Vectơ & Tích vô hướng',
    title: 'Hệ trục tọa độ Oxy & Tích vô hướng của hai vectơ',
    type: 'formula',
    summary: 'Công thức tọa độ trung điểm, trọng tâm tam giác, độ dài vectơ và góc giữa hai vectơ.',
    content: `### 1. Tọa độ của các điểm đặc biệt
- Trung điểm $I$ của $AB$: $x_I = \\frac{x_A + x_B}{2}, \\; y_I = \\frac{y_A + y_B}{2}$
- Trọng tâm $G$ của $\\triangle ABC$: $x_G = \\frac{x_A + x_B + x_C}{3}, \\; y_G = \\frac{y_A + y_B + y_C}{3}$

### 2. Tích vô hướng
- Định nghĩa: $\\vec{a} \\cdot \\vec{b} = |\\vec{a}|\\cdot|\\vec{b}|\\cdot\\cos(\\vec{a}, \\vec{b})$
- Biểu thức tọa độ: $\\vec{a} \\cdot \\vec{b} = x_1 x_2 + y_1 y_2$
- Điều kiện vuông góc: $\\vec{a} \\perp \\vec{b} \\iff x_1 x_2 + y_1 y_2 = 0$.`,
    latexFormula: '\\vec{a} \\cdot \\vec{b} = x_1 x_2 + y_1 y_2',
    tags: ['Toán 10', 'Vectơ', 'Tích vô hướng'],
    relatedTool: {
      toolType: 'graph',
      initialConfig: { expr: '2*x - 1', title: 'Đường thẳng vuông góc trên Oxy' },
    },
    updatedAt: '2026-11-12',
  },
  {
    id: 'ly-12-2',
    subjectId: 'ly',
    gradeId: 12,
    chapter: 'Chương 2: Sóng cơ và Sóng âm',
    title: 'Phương trình sóng cơ học & Giao thoa sóng hai nguồn kết hợp',
    type: 'theory',
    summary: 'Bước sóng λ = vT = v/f, phương trình sóng tại M, điều kiện cực đại và cực tiểu giao thoa.',
    content: `### 1. Các đại lượng đặc trưng của sóng cơ
- Bước sóng $\\lambda = v \\cdot T = \\frac{v}{f}$ (quãng đường sóng truyền đi trong 1 chu kỳ).
- Phương trình sóng tại $M$ cách nguồn $O$ một đoạn $d$:
$$u_M = A \\cos\\left(\\omega t - \\frac{2\\pi d}{\\lambda}\\right)$$

### 2. Giao thoa sóng hai nguồn cùng pha
- Cực đại giao thoa: $d_2 - d_1 = k\\lambda \\quad (k \\in \\mathbb{Z})$
- Cực tiểu giao thoa: $d_2 - d_1 = \\left(k + \\frac{1}{2}\\right)\\lambda \\quad (k \\in \\mathbb{Z})$.`,
    latexFormula: '\\lambda = v \\cdot T = \\frac{v}{f}',
    tags: ['Vật lý 12', 'Sóng cơ', 'Giao thoa'],
    relatedTool: {
      toolType: 'physics',
      initialConfig: { mode: 'wave' },
    },
    updatedAt: '2026-11-12',
  },
  {
    id: 'hoa-10-2',
    subjectId: 'hoa',
    gradeId: 10,
    chapter: 'Chương 2: Bảng tuần hoàn các nguyên tố hóa học',
    title: 'Cấu hình electron nguyên tử & Quy luật biến đổi tuần hoàn',
    type: 'theory',
    summary: 'Nguyên lý Pauli, quy tắc Hund, cách xác định ô, chu kỳ, nhóm và xu hướng biến đổi bán kính, độ âm điện.',
    content: `### 1. Thứ tự mức năng lượng & Phân lớp
- Thứ tự phân lớp: $1s\\; 2s\\; 2p\\; 3s\\; 3p\\; 4s\\; 3d\\; 4p\\dots$
- Số electron tối đa trên mỗi phân lớp: $s^2, p^6, d^{10}, f^{14}$.

### 2. Quy luật biến đổi trong một chu kỳ (từ trái sang phải)
- Bán kính nguyên tử giảm dần.
- Độ âm điện và tính phi kim tăng dần, tính kim loại giảm dần.`,
    latexFormula: '1s^2 2s^2 2p^6 3s^2 3p^6 \\dots',
    tags: ['Hóa 10', 'Cấu hình e', 'Bảng tuần hoàn'],
    relatedTool: {
      toolType: 'chemistry',
      initialConfig: { moleculeId: 'ch4' },
    },
    updatedAt: '2026-11-12',
  },
  {
    id: 'anh-10-2',
    subjectId: 'anh',
    gradeId: 10,
    chapter: 'Unit 5: Inventions & Present Perfect',
    title: 'Present Perfect vs. Past Simple (Thì Hiện tại hoàn thành & Quá khứ đơn)',
    type: 'formula',
    summary: 'Phân biệt hành động đã kết thúc ở quá khứ có thời gian xác định và hành động kéo dài đến hiện tại.',
    content: `### 1. Present Perfect (Hiện tại hoàn thành)
- Công thức: $S + have/has + V_3/ed$
- Dấu hiệu: *since, for, already, yet, just, recently, so far, ever, never*.

### 2. Past Simple (Quá khứ đơn)
- Công thức: $S + V_2/ed$
- Dấu hiệu: *yesterday, ago, last week/year, in 2020*.
- Quy đổi kinh điển: *S + started/began + V-ing + ... ago $\\iff$ S + have/has + V3/ed + for/since ...*`,
    latexFormula: 'S + have/has + V_{pII} \\quad (since / for)',
    tags: ['Tiếng Anh 10', 'Present Perfect', 'Past Simple'],
    relatedTool: {
      toolType: 'english',
      initialConfig: { grade: 10 },
    },
    updatedAt: '2026-11-12',
  },
];

// Presets for 3D Molecule Visualizer
export const MOLECULE_PRESETS: MoleculePreset[] = [
  {
    id: 'h2o',
    name: 'Nước',
    formula: 'H₂O',
    nameVi: 'Phân tử Nước (Góc gấp khúc 104.5°)',
    grade: 8,
    category: 'Vô cơ',
    geometry: 'Gấp khúc (Bent)',
    description: 'Nguyên tử Oxi ở tâm lai hóa sp3 liên kết với 2 nguyên tử Hiđro. Hai cặp electron tự do đẩy góc liên kết xuống 104.5°.',
    atoms: [
      { element: 'O', position: [0, 0.2, 0] },
      { element: 'H', position: [-0.8, -0.4, 0] },
      { element: 'H', position: [0.8, -0.4, 0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
    ],
  },
  {
    id: 'co2',
    name: 'Khí Cacbonic',
    formula: 'CO₂',
    nameVi: 'Cacbon đioxit (Đường thẳng 180°)',
    grade: 8,
    category: 'Vô cơ',
    geometry: 'Thẳng hàng (Linear)',
    description: 'Cacbon lai hóa sp tạo 2 liên kết đôi với 2 nguyên tử Oxi. Không còn cặp e tự do nên góc liên kết chuẩn 180°.',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'O', position: [-1.4, 0, 0] },
      { element: 'O', position: [1.4, 0, 0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 },
    ],
  },
  {
    id: 'ch4',
    name: 'Metan',
    formula: 'CH₄',
    nameVi: 'Metan (Tứ diện đều 109.5°)',
    grade: 9,
    category: 'Hữu cơ',
    geometry: 'Tứ diện đều (Tetrahedral)',
    description: 'Nguyên tử C lai hóa sp3 liên kết với 4 nguyên tử H hướng về 4 đỉnh của hình tứ diện đều. Góc liên kết 109.5°.',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'H', position: [0, 1.1, 0] },
      { element: 'H', position: [1.04, -0.37, 0] },
      { element: 'H', position: [-0.52, -0.37, 0.9] },
      { element: 'H', position: [-0.52, -0.37, -0.9] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
    ],
  },
  {
    id: 'nh3',
    name: 'Amoniac',
    formula: 'NH₃',
    nameVi: 'Amoniac (Chóp tam giác 107°)',
    grade: 10,
    category: 'Vô cơ',
    geometry: 'Chóp tam giác (Trigonal Pyramidal)',
    description: 'Nitơ lai hóa sp3 liên kết với 3 nguyên tử H và mang 1 cặp e tự do ở đỉnh chóp, ép góc liên kết xuống 107°.',
    atoms: [
      { element: 'N', position: [0, 0.3, 0] },
      { element: 'H', position: [0, -0.4, 0.95] },
      { element: 'H', position: [0.82, -0.4, -0.48] },
      { element: 'H', position: [-0.82, -0.4, -0.48] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
    ],
  },
  {
    id: 'c2h4',
    name: 'Etilen',
    formula: 'C₂H₄',
    nameVi: 'Etilen (Mặt phẳng liên kết đôi C=C)',
    grade: 9,
    category: 'Hữu cơ',
    geometry: 'Phẳng (Planar)',
    description: 'Hai nguyên tử C lai hóa sp2 tạo liên kết đôi C=C gồm 1 liên kết sigma và 1 liên kết pi. Toàn bộ 6 nguyên tử nằm trên cùng một mặt phẳng.',
    atoms: [
      { element: 'C', position: [-0.67, 0, 0] },
      { element: 'C', position: [0.67, 0, 0] },
      { element: 'H', position: [-1.25, 0.95, 0] },
      { element: 'H', position: [-1.25, -0.95, 0] },
      { element: 'H', position: [1.25, 0.95, 0] },
      { element: 'H', position: [1.25, -0.95, 0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 1, to: 4, order: 1 },
      { from: 1, to: 5, order: 1 },
    ],
  },
  {
    id: 'c2h5oh',
    name: 'Etanol (Cồn)',
    formula: 'C₂H₅OH',
    nameVi: 'Etanol / Cồn Etylic (Nhóm chức -OH)',
    grade: 11,
    category: 'Hữu cơ',
    geometry: 'Chuỗi mạch hở',
    description: 'Ancol đơn chức mạch hở gồm gốc etyl C2H5 liên kết với nhóm hydroxyl -OH.',
    atoms: [
      { element: 'C', position: [-1.1, -0.2, 0] },
      { element: 'C', position: [0.2, 0.4, 0] },
      { element: 'O', position: [1.3, -0.4, 0] },
      { element: 'H', position: [2.1, -0.1, 0] },
      { element: 'H', position: [-1.8, 0.5, 0] },
      { element: 'H', position: [-1.2, -0.8, 0.9] },
      { element: 'H', position: [-1.2, -0.8, -0.9] },
      { element: 'H', position: [0.3, 1.0, 0.9] },
      { element: 'H', position: [0.3, 1.0, -0.9] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
    ],
  },
  {
    id: 'c6h6',
    name: 'Benzen',
    formula: 'C₆H₆',
    nameVi: 'Benzen (Vòng thơm 6 cạnh đều phẳng)',
    grade: 11,
    category: 'Hữu cơ',
    geometry: 'Lục giác đều phẳng (Hexagonal Planar)',
    description: 'Hệ liên hợp pi khép kín bền vững đặc trưng của hydrocacbon thơm.',
    atoms: [
      { element: 'C', position: [1.4, 0, 0] },
      { element: 'C', position: [0.7, 1.21, 0] },
      { element: 'C', position: [-0.7, 1.21, 0] },
      { element: 'C', position: [-1.4, 0, 0] },
      { element: 'C', position: [-0.7, -1.21, 0] },
      { element: 'C', position: [0.7, -1.21, 0] },
      { element: 'H', position: [2.4, 0, 0] },
      { element: 'H', position: [1.2, 2.08, 0] },
      { element: 'H', position: [-1.2, 2.08, 0] },
      { element: 'H', position: [-2.4, 0, 0] },
      { element: 'H', position: [-1.2, -2.08, 0] },
      { element: 'H', position: [1.2, -2.08, 0] },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 2 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 2 },
      { from: 5, to: 0, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
      { from: 2, to: 8, order: 1 },
      { from: 3, to: 9, order: 1 },
      { from: 4, to: 10, order: 1 },
      { from: 5, to: 11, order: 1 },
    ],
  },
  {
    id: 'nacl',
    name: 'Muối Ăn',
    formula: 'NaCl',
    nameVi: 'Mạng Tinh Thể Lập Phương Muối Ăn (NaCl)',
    grade: 10,
    category: 'Tinh thể',
    geometry: 'Mạng lập phương tâm diện',
    description: 'Mỗi ion Na+ được bao quanh bởi 6 ion Cl- và ngược lại, tạo thành liên kết ion cực kỳ bền vững.',
    atoms: [
      { element: 'Na', position: [0, 0, 0] },
      { element: 'Cl', position: [1.1, 0, 0] },
      { element: 'Cl', position: [-1.1, 0, 0] },
      { element: 'Cl', position: [0, 1.1, 0] },
      { element: 'Cl', position: [0, -1.1, 0] },
      { element: 'Cl', position: [0, 0, 1.1] },
      { element: 'Cl', position: [0, 0, -1.1] },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
    ],
  },
];

// Presets for 3D Bohr Atomic Model
export const ATOM_BOHR_PRESETS: AtomBohrPreset[] = [
  { symbol: 'H', nameVi: 'Hiđro', Z: 1, shells: [1], description: '1 proton ở hạt nhân, 1 electron trên lớp vỏ K.' },
  { symbol: 'He', nameVi: 'Heli', Z: 2, shells: [2], description: 'Khí hiếm bền vững với 2 electron bão hòa lớp vỏ K.' },
  { symbol: 'C', nameVi: 'Cacbon', Z: 6, shells: [2, 4], description: 'Lớp K (2e), Lớp L ngoài cùng (4e) có khả năng tạo 4 liên kết cộng hóa trị.' },
  { symbol: 'N', nameVi: 'Nitơ', Z: 7, shells: [2, 5], description: 'Lớp K (2e), Lớp L ngoài cùng (5e).' },
  { symbol: 'O', nameVi: 'Oxi', Z: 8, shells: [2, 6], description: 'Lớp K (2e), Lớp L ngoài cùng (6e), độ âm điện cao 3.44.' },
  { symbol: 'Na', nameVi: 'Natri', Z: 11, shells: [2, 8, 1], description: 'Kim loại kiềm: Lớp K (2e), Lớp L (8e), Lớp M (1e) rất dễ nhường để tạo cation Na+.' },
  { symbol: 'Cl', nameVi: 'Clo', Z: 17, shells: [2, 8, 7], description: 'Halogen: Lớp K (2e), Lớp L (8e), Lớp M (7e) rất dễ nhận 1e để đạt bát thế bền.' },
];

// Flashcards for English by Grade
export const ENGLISH_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-8-1',
    word: 'pasture',
    ipa: '/ˈpɑːstʃə(r)/',
    partOfSpeech: 'noun',
    vietnameseMeaning: 'Đồng cỏ, bãi cỏ chăn thả gia súc',
    exampleEn: 'The horses were grazing peacefully in the lush pasture.',
    exampleVi: 'Đàn ngựa đang gặm cỏ thanh bình trên cánh đồng cỏ tươi tốt.',
    grade: 8,
    topic: 'Life in the countryside',
  },
  {
    id: 'fc-8-2',
    word: 'harvest',
    ipa: '/ˈhɑːvɪst/',
    partOfSpeech: 'noun / verb',
    vietnameseMeaning: 'Vụ thu hoạch; thu hoạch lúa, mùa màng',
    exampleEn: 'Farmers work from dawn till dusk during the rice harvest.',
    exampleVi: 'Nông dân làm việc từ sáng sớm đến tối mịt trong vụ gặt lúa.',
    grade: 8,
    topic: 'Life in the countryside',
  },
  {
    id: 'fc-9-1',
    word: 'multilingual',
    ipa: '/ˌmʌltiˈlɪŋɡwəl/',
    partOfSpeech: 'adj',
    vietnameseMeaning: 'Đa ngôn ngữ, nói được nhiều thứ tiếng',
    exampleEn: 'Being multilingual opens up numerous career opportunities globally.',
    exampleVi: 'Biết nhiều thứ tiếng mở ra vô vàn cơ hội nghề nghiệp toàn cầu.',
    grade: 9,
    topic: 'English in the World',
  },
  {
    id: 'fc-9-2',
    word: 'dialect',
    ipa: '/ˈdaɪəlekt/',
    partOfSpeech: 'noun',
    vietnameseMeaning: 'Tiếng địa phương, phương ngữ',
    exampleEn: 'People in northern and southern regions speak distinct dialects.',
    exampleVi: 'Người dân ở vùng miền Bắc và miền Nam nói các phương ngữ riêng biệt.',
    grade: 9,
    topic: 'English in the World',
  },
  {
    id: 'fc-10-1',
    word: 'innovative',
    ipa: '/ˈɪnəveɪtɪv/',
    partOfSpeech: 'adj',
    vietnameseMeaning: 'Đổi mới, có tính sáng tạo và cách tân',
    exampleEn: 'The tutor introduced an innovative method using 3D simulations.',
    exampleVi: 'Gia sư đã giới thiệu một phương pháp sáng tạo bằng mô phỏng 3D.',
    grade: 10,
    topic: 'New Ways to Learn',
  },
  {
    id: 'fc-10-2',
    word: 'biodiversity',
    ipa: '/ˌbaɪəʊdaɪˈvɜːsəti/',
    partOfSpeech: 'noun',
    vietnameseMeaning: 'Đa dạng sinh học',
    exampleEn: 'Protecting rainforests is crucial for preserving global biodiversity.',
    exampleVi: 'Bảo vệ rừng nhiệt đới rất quan trọng để gìn giữ đa dạng sinh học toàn cầu.',
    grade: 10,
    topic: 'Protecting the Environment',
  },
  {
    id: 'fc-11-1',
    word: 'independent',
    ipa: '/ˌɪndɪˈpendənt/',
    partOfSpeech: 'adj',
    vietnameseMeaning: 'Tự lập, độc lập',
    exampleEn: 'High school students should cultivate independent thinking skills.',
    exampleVi: 'Học sinh trung học phổ thông nên trau dồi kỹ năng tư duy độc lập.',
    grade: 11,
    topic: 'Becoming Independent',
  },
  {
    id: 'fc-11-2',
    word: 'sustainable',
    ipa: '/səˈsteɪnəbl/',
    partOfSpeech: 'adj',
    vietnameseMeaning: 'Bền vững, thân thiện với môi trường',
    exampleEn: 'Solar energy provides a sustainable alternative to fossil fuels.',
    exampleVi: 'Năng lượng mặt trời đem lại giải pháp thay thế bền vững cho nhiên liệu hóa thạch.',
    grade: 11,
    topic: 'Our Green Future',
  },
  {
    id: 'fc-12-1',
    word: 'perseverance',
    ipa: '/ˌpɜːsɪˈvɪərəns/',
    partOfSpeech: 'noun',
    vietnameseMeaning: 'Sự kiên trì, bền chí vượt qua khó khăn',
    exampleEn: 'Academic success requires constant effort and unwavering perseverance.',
    exampleVi: 'Thành công trong học tập đòi hỏi nỗ lực liên tục và sự kiên trì không lay chuyển.',
    grade: 12,
    topic: 'Lifelong Learning & Careers',
  },
  {
    id: 'fc-12-2',
    word: 'curriculum',
    ipa: '/kəˈrɪkjələm/',
    partOfSpeech: 'noun',
    vietnameseMeaning: 'Khung chương trình học tập / giáo trình',
    exampleEn: 'The high school curriculum has incorporated practical STEM applications.',
    exampleVi: 'Chương trình giảng dạy cấp ba đã lồng ghép các ứng dụng STEM thực tế.',
    grade: 12,
    topic: 'Education & Future Plans',
  },
];
