// One-time import: replaces the short 3-paragraph body content of all 7
// articles with new, longer, more comprehensive bilingual content (8
// paragraphs each), and updates each article's meta.read_time_en/ar to
// match the new length. Preserves title_en/ar, text_en/ar (teaser), and all
// other meta fields (slug/date/category) unchanged.
//
// Usage: node scripts/import-full-article-content.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  const content = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnvLocal();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SECTION_ID = "fd950685-1988-4cbb-86d1-3d403b09ac19";

const ARTICLES = {
  "f95fa408-3bef-4e65-af85-269742012cdc": "neuronavigation-revolution",
  "fa28e9ca-b8f7-4f57-98be-34cbef663192": "when-to-see-a-neurosurgeon",
  "5365eb17-b287-4525-a15e-443e8e69265d": "brain-tumor-treatment-innovations",
  "bfc76fb2-965e-4019-8efa-08b3e52a8d03": "prevent-lower-back-pain-office-workers",
  "fed82e97-876b-4695-9f48-03019dc9cc82": "pituitary-tumor-symptoms",
  "17826691-0891-427a-a1b3-b85a52c40ac7": "cerebral-aneurysms-treatment",
  "e538c131-5ae8-4103-9797-e31beb1c5b8f": "refractory-epilepsy-surgery",
};

const CONTENT = {
  "neuronavigation-revolution": {
    read_time_en: "9 min read",
    read_time_ar: "9 دقائق قراءة",
    en: [
      "Brain tumor surgery has undergone one of the most significant transformations in modern neurosurgery over the past two decades, and much of that progress traces back to a single technology: neuronavigation. What was once considered a specialized tool available only in a handful of academic centers is now a standard part of care in advanced neurosurgical practice, fundamentally changing how surgeons plan and execute the removal of brain tumors.",
      "Neuronavigation works much like a GPS system, but instead of mapping streets, it maps the three-dimensional anatomy of an individual patient's brain. Before surgery, a patient's MRI and CT scans are fused together into a single, highly detailed 3D model that highlights the tumor's exact location, its relationship to surrounding structures, and critical pathways such as blood vessels and nerve fiber tracts.",
      "During the operation itself, the surgical team uses specialized instruments fitted with infrared or electromagnetic sensors. As the surgeon moves these instruments, their position is tracked in real time and displayed on the 3D model on a screen in the operating room, similar to watching a cursor move across a map. This allows the surgeon to know, at every moment, exactly where they are relative to the tumor and the healthy tissue around it.",
      "The clinical benefits of this precision are substantial. Surgeons can plan smaller, more targeted incisions and craniotomies rather than opening a wider area to visually locate the tumor. Just as importantly, navigation helps surgeons stay a safe distance from regions of the brain responsible for speech, movement, vision, and other essential functions, reducing the risk of new neurological deficits after surgery.",
      "One well-recognized challenge in brain surgery is called 'brain shift' — once the skull is opened and cerebrospinal fluid drains, brain tissue can shift slightly from its pre-operative position, which can make older imaging less accurate mid-procedure. To address this, many modern operating rooms combine neuronavigation with intraoperative imaging, such as intraoperative MRI or ultrasound, allowing the surgical team to re-register the anatomical map during the operation for continued accuracy.",
      "For tumors located near areas that control language or movement, navigation is often paired with functional mapping techniques, including cortical stimulation and, in select cases, an awake craniotomy in which the patient is kept alert during part of the procedure to test brain function in real time. Combining these tools allows for more extensive tumor removal while actively protecting the functions that matter most to a patient's daily life.",
      "It is important to understand that neuronavigation is a powerful aid, not a replacement for surgical judgment and experience. The technology provides information; the surgeon still interprets that information, adapts to what is found during the operation, and makes the critical decisions that determine the outcome. The best results come from combining advanced technology with a highly experienced surgical team.",
      "Every brain tumor is different, and the right surgical approach depends on the tumor's size, location, type, and each patient's overall health. If you or a family member has been told that surgery may be needed for a brain tumor, a thorough evaluation with a neurosurgeon experienced in image-guided techniques is the best next step toward understanding your specific options.",
    ],
    ar: [
      "شهدت جراحات أورام المخ واحدة من أهم نقلات التطور في تاريخ جراحة الأعصاب الحديثة خلال العقدين الماضيين، ويعود جزء كبير من هذا التقدم إلى تقنية واحدة: الملاحة العصبية (Neuronavigation). فما كان يُعد أداة متخصصة متاحة فقط في عدد محدود من المراكز الأكاديمية، أصبح اليوم جزءًا أساسيًا من الممارسة الجراحية المتقدمة، وغيّر بشكل جذري الطريقة التي يخطط بها الجراحون لاستئصال أورام المخ وتنفيذها.",
      "تعمل الملاحة العصبية بمبدأ شبيه بأنظمة تحديد المواقع (GPS)، لكن بدلاً من رسم خرائط الشوارع، فهي ترسم التركيب التشريحي ثلاثي الأبعاد لمخ كل مريض على حدة. فقبل العملية، يتم دمج صور الرنين المغناطيسي والأشعة المقطعية للمريض في نموذج ثلاثي الأبعاد دقيق للغاية، يوضح الموقع الدقيق للورم وعلاقته بالتراكيب المحيطة به، بالإضافة إلى المسارات الحساسة كالأوعية الدموية والحزم العصبية.",
      "وأثناء العملية نفسها، يستخدم الفريق الجراحي أدوات جراحية مزودة بحساسات دقيقة تعمل بالأشعة تحت الحمراء أو المجال الكهرومغناطيسي. ومع تحريك الجراح لهذه الأدوات، يتم تتبّع موقعها لحظيًا وعرضه على النموذج ثلاثي الأبعاد على شاشة داخل غرفة العمليات، تمامًا كمتابعة تحرك مؤشر على خريطة. وهذا يتيح للجراح معرفة موقعه بدقة بالنسبة للورم والأنسجة السليمة المحيطة به في كل لحظة.",
      "وتنعكس هذه الدقة على فوائد سريرية ملموسة؛ إذ يستطيع الجراحون التخطيط لفتحات جراحية أصغر وأكثر تحديدًا بدلاً من فتح منطقة أوسع لتحديد موقع الورم بصريًا. والأهم من ذلك أن الملاحة تساعد الجراح على الابتعاد بأمان عن المناطق المسؤولة عن الكلام والحركة والإبصار وغيرها من الوظائف الحيوية، مما يقلل من خطر حدوث أعراض عصبية جديدة بعد الجراحة.",
      "من التحديات المعروفة في جراحات المخ ما يُعرف بظاهرة 'انزياح الدماغ'؛ فبمجرد فتح الجمجمة وتصريف بعض السائل النخاعي، قد تنزاح أنسجة المخ قليلاً عن موضعها قبل الجراحة، مما قد يقلل من دقة الصور القديمة أثناء سير العملية. ولمواجهة ذلك، تعتمد كثير من غرف العمليات الحديثة على دمج الملاحة العصبية مع التصوير أثناء العملية، كالرنين المغناطيسي أو الموجات فوق الصوتية داخل غرفة العمليات، مما يتيح للفريق الجراحي إعادة معايرة الخريطة التشريحية أثناء سير العملية للحفاظ على الدقة.",
      "وبالنسبة للأورام القريبة من المناطق المسؤولة عن الكلام أو الحركة، غالبًا ما تُستخدم الملاحة جنبًا إلى جنب مع تقنيات رسم الخرائط الوظيفية، مثل التنبيه القشري، وفي حالات مختارة إجراء الجراحة واليقظ (Awake Craniotomy) حيث يظل المريض واعيًا خلال جزء من العملية لاختبار الوظائف الدماغية لحظيًا. ويتيح الجمع بين هذه الأدوات استئصالاً أوسع للورم مع الحفاظ الفعّال على الوظائف الأكثر أهمية لحياة المريض اليومية.",
      "ومن المهم إدراك أن الملاحة العصبية أداة مساعدة قوية وليست بديلاً عن خبرة الجراح وحكمه المهني؛ فالتقنية توفر معلومات، لكن الجراح هو من يفسّر هذه المعلومات ويتكيّف مع ما يكتشفه أثناء العملية ويتخذ القرارات الحاسمة التي تحدد نتيجة الجراحة. وأفضل النتائج تتحقق عند الجمع بين التقنية المتطورة وفريق جراحي على درجة عالية من الخبرة.",
      "ولأن كل ورم دماغي يختلف عن الآخر، فإن الأسلوب الجراحي الأنسب يتوقف على حجم الورم وموقعه ونوعه، وكذلك الحالة الصحية العامة للمريض. فإذا أُخبرت أنت أو أحد أفراد أسرتك بضرورة إجراء جراحة لورم في المخ، فإن التقييم الشامل مع جراح أعصاب ذي خبرة في تقنيات التوجيه بالصور يُعد أفضل خطوة تالية لفهم الخيارات المتاحة لحالتك تحديدًا.",
    ],
  },
  "when-to-see-a-neurosurgeon": {
    read_time_en: "6 min read",
    read_time_ar: "6 دقائق قراءة",
    en: [
      "Headaches, back pain, and occasional dizziness are extremely common, and the vast majority of the time they are not signs of a serious neurological problem. However, certain symptoms — especially when they appear suddenly, worsen quickly, or occur in combination — deserve prompt attention from a neurosurgeon rather than being dismissed as everyday discomfort.",
      "One of the clearest warning signs is a sudden, severe headache that patients often describe as 'the worst headache of my life,' reaching maximum intensity within seconds to minutes. This type of thunderclap headache can be associated with a bleed inside or around the brain, such as a ruptured aneurysm, and always warrants immediate emergency evaluation rather than a scheduled appointment.",
      "Sudden weakness or numbness on one side of the body — whether in the face, an arm, or a leg — is another red flag. This pattern can indicate a problem affecting the brain's motor pathways, and the sooner it is evaluated, the better the chances of identifying the cause and starting appropriate treatment before any damage becomes permanent.",
      "Progressive or persistent headaches accompanied by visual disturbances, such as blurred or double vision, are also worth taking seriously, particularly when the headache is worse in the morning or triggered by coughing and straining. This combination can point to increased pressure inside the skull, which may result from a variety of causes that a neurosurgical evaluation with brain imaging can help clarify.",
      "Sudden problems with balance, coordination, or the ability to walk normally — especially when paired with slurred speech, confusion, or facial drooping — should never be ignored. These signs can reflect a problem in the brain or brainstem and, in some cases, represent a time-sensitive emergency where every minute of delay matters.",
      "Chronic back or neck pain deserves urgent attention when it is accompanied by specific warning signs: progressive weakness or numbness in the arms or legs, loss of bladder or bowel control, unexplained weight loss, or pain that is worse at night and does not improve with rest. These 'red flag' symptoms can indicate significant nerve compression that may require prompt surgical evaluation to prevent lasting nerve damage.",
      "It's just as important to know what generally does not require emergency care: most mild, intermittent headaches, ordinary muscle-related back pain after activity, and brief, isolated dizziness usually resolve on their own or respond well to conservative treatment. The key distinction is the presence of the specific warning signs described above, or symptoms that are new, rapidly worsening, or unlike anything you have experienced before.",
      "If you recognize any of these warning signs in yourself or a loved one, don't wait to 'see if it gets better.' For sudden, severe symptoms, go to the nearest emergency room immediately. For persistent or gradually worsening symptoms, book a consultation with a neurosurgeon so your case can be properly evaluated, imaged if needed, and directed toward the right treatment path as early as possible.",
    ],
    ar: [
      "يُعد الصداع وآلام الظهر والدوخة العرضية من الشكاوى الشائعة جدًا، وفي الغالبية العظمى من الحالات لا تكون علامة على مشكلة عصبية خطيرة. إلا أن بعض الأعراض، خاصة عند ظهورها المفاجئ أو تفاقمها السريع أو تزامنها مع أعراض أخرى، تستحق اهتمامًا فوريًا من جراح مخ وأعصاب بدلاً من اعتبارها مجرد إزعاج يومي عابر.",
      "من أوضح العلامات التحذيرية الصداع المفاجئ الشديد الذي يصفه المرضى غالبًا بأنه 'أسوأ صداع في حياتهم'، ويصل إلى ذروته خلال ثوانٍ إلى دقائق معدودة. هذا النوع من الصداع الصاعقي قد يرتبط بنزيف داخل المخ أو حوله، كتمزق أحد تمددات الأوعية الدموية، ويستدعي دائمًا تدخلاً طارئًا فوريًا وليس مجرد حجز موعد عادي.",
      "كذلك يُعد الضعف أو التنميل المفاجئ في جانب واحد من الجسم، سواء في الوجه أو الذراع أو الساق، علامة تحذيرية أخرى. فهذا النمط قد يشير إلى مشكلة تؤثر على المسارات الحركية في المخ، وكلما كان التقييم أسرع، زادت فرص تحديد السبب وبدء العلاج المناسب قبل أن يصبح أي ضرر دائمًا.",
      "الصداع المستمر أو المتصاعد المصحوب باضطرابات بصرية كالرؤية المزدوجة أو الزغللة يستحق أيضًا اهتمامًا جادًا، خاصة إذا كان أسوأ في الصباح أو يتفاقم مع السعال أو الشد. فهذا المزيج قد يشير إلى ارتفاع الضغط داخل الجمجمة، والذي قد ينتج عن أسباب متعددة يمكن لتقييم جراحة الأعصاب مع الأشعة التشخيصية أن يوضحها.",
      "المشكلات المفاجئة في التوازن أو التناسق الحركي أو القدرة على المشي بشكل طبيعي، خاصة إذا ترافقت مع تداخل في الكلام أو ارتباك ذهني أو ترهل في أحد جانبي الوجه، لا ينبغي تجاهلها أبدًا. فهذه العلامات قد تعكس مشكلة في المخ أو جذع الدماغ، وفي بعض الحالات تمثل حالة طارئة حساسة للوقت حيث تكون كل دقيقة تأخير مؤثرة.",
      "أما آلام الرقبة أو الظهر المزمنة فتستحق اهتمامًا عاجلاً عند تزامنها مع علامات تحذيرية محددة: ضعف أو تنميل متصاعد في الذراعين أو الساقين، فقدان السيطرة على المثانة أو الأمعاء، فقدان وزن غير مبرر، أو ألم يزداد ليلاً ولا يتحسن مع الراحة. فهذه 'العلامات الحمراء' قد تشير إلى ضغط عصبي كبير قد يتطلب تقييمًا جراحيًا سريعًا لتجنب أي ضرر عصبي دائم.",
      "ومن المهم بنفس القدر معرفة ما لا يستدعي عادة رعاية طارئة: فمعظم حالات الصداع الخفيف المتقطع، وآلام الظهر العضلية المعتادة بعد المجهود، والدوخة العابرة المنفردة، تُشفى غالبًا من تلقاء نفسها أو تستجيب جيدًا للعلاج التحفظي. والفيصل الحقيقي هو وجود العلامات التحذيرية المذكورة أعلاه، أو ظهور أعراض جديدة تتفاقم بسرعة أو لا تشبه أي شيء اختبرته من قبل.",
      "إذا لاحظت أيًا من هذه العلامات التحذيرية على نفسك أو أحد أفراد أسرتك، فلا تنتظر لترى إن كانت ستتحسن من تلقاء نفسها. في حالة الأعراض المفاجئة الشديدة، توجه فورًا إلى أقرب قسم طوارئ. أما في حالة الأعراض المستمرة أو المتفاقمة تدريجيًا، فاحجز استشارة مع جراح مخ وأعصاب حتى يتم تقييم حالتك بشكل صحيح، وإجراء الأشعة اللازمة إن استدعى الأمر، وتوجيهك إلى المسار العلاجي الصحيح في أقرب وقت ممكن.",
    ],
  },
  "brain-tumor-treatment-innovations": {
    read_time_en: "7 min read",
    read_time_ar: "7 دقائق قراءة",
    en: [
      "The philosophy behind brain tumor surgery has shifted dramatically in recent years. Where older approaches often relied on wide craniotomies to give the surgeon a broad visual field, today's emphasis is on achieving the same or better tumor control through smaller, more precise access — a concept often summarized as 'maximal safe resection through minimal footprint.'",
      "Image-guided navigation and intraoperative imaging, discussed in more detail elsewhere on this site, remain the foundation of this approach, allowing the surgical team to plan the shortest, safest path to a tumor before the first incision is even made. Building on that foundation, several complementary technologies have expanded what is possible for patients.",
      "Minimally invasive tubular retractor systems are one such advance. Rather than retracting large areas of brain tissue to reach a deep-seated tumor, the surgeon works through a narrow, dilating tube that gently spreads tissue along a single corridor rather than compressing it broadly. This approach can reduce trauma to healthy brain tissue along the surgical path, particularly for tumors located deep within the brain.",
      "For tumors near or within the brain's fluid-filled ventricles, endoscopic-assisted techniques allow surgeons to visualize and remove tumor tissue through a small opening using a high-definition camera and specialized instruments, often avoiding the need for a larger craniotomy altogether in carefully selected cases.",
      "Laser interstitial thermal therapy, commonly known as LITT, is another option that has gained wider use for select tumors — including some recurrent tumors or those in locations that are difficult to reach with conventional surgery. A thin laser probe is guided to the tumor using imaging guidance, and the tumor tissue is treated with controlled heat while the surgical team monitors the treatment area with real-time MRI thermal imaging to protect surrounding structures.",
      "Advances are not limited to the operating room itself. Enhanced recovery protocols — combining multimodal pain management, earlier mobilization after surgery, and closer coordination between the surgical, anesthesia, and nursing teams — have shortened hospital stays and improved comfort for many patients undergoing brain tumor surgery.",
      "Perhaps just as important as any single technology is the shift toward multidisciplinary decision-making. Complex brain tumor cases are increasingly reviewed by a team that may include neurosurgeons, neuro-oncologists, radiation oncologists, and pathologists, ensuring that the recommended treatment plan — whether surgery alone, surgery combined with other therapies, or a non-surgical approach — reflects the full picture of the tumor and the patient's overall health.",
      "Not every new technology is appropriate for every tumor, and the right combination of approaches depends heavily on the tumor's type, size, and location. A detailed discussion with a neurosurgeon, supported by proper imaging and, where needed, input from a broader treatment team, remains the best way to understand which of these advances may benefit your specific case.",
    ],
    ar: [
      "شهدت فلسفة جراحة أورام المخ تحولاً كبيرًا في السنوات الأخيرة؛ ففي حين كانت الأساليب القديمة تعتمد غالبًا على فتحات جراحية واسعة لمنح الجراح مجال رؤية أوسع، أصبح التركيز اليوم منصبًا على تحقيق نفس النتيجة أو أفضل في السيطرة على الورم من خلال منفذ جراحي أصغر وأكثر دقة، وهو مفهوم يُختصر غالبًا بعبارة 'أقصى استئصال آمن بأقل تدخل ممكن'.",
      "تظل تقنيات التوجيه بالصور والتصوير أثناء العملية، التي تناولناها بتفصيل أكبر في مقال آخر على الموقع، هي الأساس الذي تُبنى عليه هذه الفلسفة، إذ تتيح للفريق الجراحي التخطيط لأقصر وأكثر المسارات أمانًا للوصول إلى الورم حتى قبل إجراء أول شق جراحي. وبناءً على هذا الأساس، ظهرت عدة تقنيات مكمّلة وسّعت من نطاق الممكن لصالح المرضى.",
      "من هذه التطورات أنظمة السحب الأنبوبية طفيفة التوغل؛ فبدلاً من سحب مساحات واسعة من أنسجة المخ للوصول إلى ورم عميق، يعمل الجراح عبر أنبوب رفيع يتمدد تدريجيًا ليفتح ممرًا واحدًا برفق بدلاً من ضغط الأنسجة على نطاق واسع. ويساعد هذا الأسلوب في تقليل الإصابة التي قد تلحق بالأنسجة السليمة على طول المسار الجراحي، خاصة في الأورام العميقة داخل المخ.",
      "أما بالنسبة للأورام القريبة من بطينات المخ المملوءة بالسائل النخاعي أو داخلها، فتتيح التقنيات المدعومة بالمنظار للجراحين رؤية واستئصال أنسجة الورم عبر فتحة صغيرة باستخدام كاميرا عالية الدقة وأدوات متخصصة، مما يغني في حالات مختارة بعناية عن الحاجة لفتحة جراحية أكبر.",
      "ويُعد العلاج الحراري الخلالي بالليزر، المعروف اختصارًا بـ LITT، خيارًا آخر تزايد استخدامه لبعض الأورام المحددة، بما في ذلك بعض الأورام المتكررة أو تلك الموجودة في مواقع يصعب الوصول إليها بالجراحة التقليدية. حيث يتم توجيه مسبار ليزر رفيع إلى الورم بمساعدة التصوير، ثم تُعالَج أنسجة الورم بحرارة متحكم بها، بينما يراقب الفريق الجراحي منطقة العلاج بتصوير حراري بالرنين المغناطيسي لحظيًا لحماية التراكيب المحيطة.",
      "ولا تقتصر أوجه التطور على غرفة العمليات وحدها؛ فبروتوكولات التعافي المحسّن، التي تجمع بين إدارة الألم متعددة الأساليب والتحرك المبكر بعد الجراحة والتنسيق الأوثق بين فرق الجراحة والتخدير والتمريض، ساهمت في تقصير فترة الإقامة بالمستشفى وتحسين راحة كثير من المرضى الخاضعين لجراحات أورام المخ.",
      "ولعل ما لا يقل أهمية عن أي تقنية بمفردها هو التحول نحو اتخاذ القرار الجماعي متعدد التخصصات؛ إذ تُعرض الحالات المعقدة لأورام المخ بشكل متزايد على فريق قد يضم جراحي أعصاب وأخصائيي أورام عصبية وأخصائيي علاج إشعاعي وأخصائيي تشريح مرضي، لضمان أن تعكس خطة العلاج الموصى بها، سواء كانت جراحة منفردة أو جراحة مصحوبة بعلاجات أخرى أو نهجًا غير جراحي، الصورة الكاملة لطبيعة الورم والحالة الصحية العامة للمريض.",
      "وليست كل تقنية جديدة مناسبة لكل ورم، فالمزيج الأنسب من الأساليب يعتمد بشكل كبير على نوع الورم وحجمه وموقعه. ويظل النقاش التفصيلي مع جراح أعصاب، مدعومًا بالأشعة التشخيصية المناسبة، وبمشاركة فريق علاجي أوسع عند الحاجة، أفضل وسيلة لفهم أي من هذه التطورات قد يفيد حالتك تحديدًا.",
    ],
  },
  "prevent-lower-back-pain-office-workers": {
    read_time_en: "7 min read",
    read_time_ar: "7 دقائق قراءة",
    en: [
      "Lower back pain is one of the most common complaints among people who spend long hours at a desk, and it's not hard to see why. Prolonged sitting places sustained pressure on the discs and joints of the lumbar spine, while weakened core and hip muscles — a common result of an inactive routine — leave the lower back with less natural support throughout the day. The good news is that most desk-related back pain is preventable with a few consistent habits.",
      "The starting point for many office workers should be their workstation setup. Your chair should support the natural inward curve of your lower back, either through a built-in lumbar support or a small cushion. Your feet should rest flat on the floor or a footrest, your knees roughly level with your hips, and your monitor positioned at eye level so you aren't repeatedly leaning forward or tilting your head down to see the screen.",
      "Posture matters as much as furniture. Aim to sit with your back against the chair, shoulders relaxed rather than hunched forward, and your hips pushed back into the seat rather than perched on the edge. Try to avoid crossing your legs for extended periods, as this can tilt the pelvis and add uneven pressure to the lower back and hips over time.",
      "Perhaps the single most effective habit is simply not staying still for too long. Even a perfect sitting posture becomes a source of strain if held for hours without a break. Aim to stand, stretch, or walk for a few minutes every 30 to 45 minutes — setting a reminder can help build this into your routine until it becomes automatic.",
      "Strengthening the muscles that support the spine is equally important. Simple, low-impact exercises such as bridges, planks, and bird-dog movements help build core and hip stability, which reduces the load placed directly on the spinal structures during daily activities. These exercises can typically be done at home in ten to fifteen minutes a few times a week.",
      "Stretching complements strengthening by addressing the tightness that builds up from sitting. Gentle stretches for the hip flexors, hamstrings, and the muscles around the hips and lower back can help restore flexibility that prolonged sitting tends to reduce, and are especially useful when done during your movement breaks throughout the workday.",
      "A few broader lifestyle factors also play a meaningful role: maintaining a healthy body weight reduces mechanical load on the spine, staying well hydrated supports the health of spinal discs, and managing stress matters too, since chronic tension often settles into the muscles of the neck and lower back without us realizing it.",
      "Most mild, activity-related back discomfort improves with these habits within a few weeks. However, if pain persists beyond two to three weeks despite consistent effort, or if it is accompanied by pain radiating down one leg, numbness, tingling, or noticeable weakness, it's time to consult a specialist. A spine evaluation at that stage can identify the underlying cause and guide you toward the most appropriate treatment, whether conservative therapy or, in some cases, a more targeted intervention.",
    ],
    ar: [
      "تُعد آلام أسفل الظهر من أكثر الشكاوى شيوعًا بين من يقضون ساعات طويلة في الجلوس أمام المكتب، وليس من الصعب فهم السبب. فالجلوس المطوّل يضع ضغطًا مستمرًا على أقراص ومفاصل الفقرات القطنية، بينما يترك ضعف عضلات جذع الجسم والوركين، الناتج غالبًا عن قلة الحركة، أسفل الظهر بدعم طبيعي أقل طوال اليوم. والخبر الجيد أن معظم آلام الظهر المرتبطة بالمكتب يمكن الوقاية منها ببعض العادات الثابتة.",
      "نقطة البداية لكثير من موظفي المكاتب هي إعداد مكان العمل نفسه؛ فينبغي أن يدعم الكرسي الانحناء الطبيعي لأسفل الظهر، إما من خلال دعامة قطنية مدمجة أو وسادة صغيرة. كذلك يجب أن ترتاح قدماك بشكل مسطح على الأرض أو على مسند للقدمين، وأن تكون الركبتان في مستوى مقارب لمستوى الوركين، مع وضع الشاشة على مستوى العين لتجنب الانحناء المتكرر للأمام أو إمالة الرأس للأسفل لرؤية الشاشة.",
      "وضعية الجلوس لا تقل أهمية عن الأثاث نفسه؛ احرص على أن يستند ظهرك إلى الكرسي، مع إرخاء الكتفين بدلاً من انحنائهما للأمام، ودفع الوركين إلى الخلف داخل المقعد بدلاً من الجلوس على حافته. وحاول تجنب تقاطع الساقين لفترات طويلة، إذ قد يؤدي ذلك إلى إمالة الحوض وإضافة ضغط غير متساوٍ على أسفل الظهر والوركين مع مرور الوقت.",
      "ولعل العادة الأكثر فاعلية على الإطلاق هي ببساطة عدم البقاء ثابتًا لفترة طويلة؛ فحتى وضعية الجلوس المثالية تتحول إلى مصدر للإجهاد إذا استمرت لساعات دون توقف. حاول الوقوف أو التمدد أو المشي لبضع دقائق كل 30 إلى 45 دقيقة، وقد يساعدك ضبط تنبيه دوري على جعل هذه العادة تلقائية بمرور الوقت.",
      "تقوية العضلات الداعمة للعمود الفقري لا تقل أهمية؛ فتمارين بسيطة منخفضة التأثير مثل تمرين الجسر والبلانك وحركة 'الكلب الطائر' تساعد في بناء ثبات جذع الجسم والوركين، مما يقلل من العبء الواقع مباشرة على تراكيب العمود الفقري أثناء الأنشطة اليومية. ويمكن أداء هذه التمارين عادة في المنزل خلال عشر إلى خمس عشرة دقيقة عدة مرات أسبوعيًا.",
      "وتُكمّل تمارين الإطالة عمل تمارين التقوية من خلال معالجة الشد العضلي الناتج عن الجلوس؛ فالإطالة اللطيفة لعضلات مقدمة الفخذ والخلفية والعضلات المحيطة بالوركين وأسفل الظهر تساعد في استعادة المرونة التي يقلل منها الجلوس المطوّل، وتكون مفيدة بشكل خاص عند أدائها أثناء فترات الحركة القصيرة خلال يوم العمل.",
      "وهناك أيضًا بعض العوامل المتعلقة بنمط الحياة تلعب دورًا مهمًا: فالحفاظ على وزن صحي يقلل من الحمل الميكانيكي على العمود الفقري، وشرب كمية كافية من الماء يدعم صحة أقراص العمود الفقري، كما أن إدارة التوتر النفسي مهمة أيضًا، إذ يستقر التوتر المزمن غالبًا في عضلات الرقبة وأسفل الظهر دون أن نلاحظ ذلك.",
      "تتحسن معظم آلام الظهر الخفيفة المرتبطة بالنشاط خلال أسابيع قليلة باتباع هذه العادات. لكن إذا استمر الألم لأكثر من أسبوعين إلى ثلاثة أسابيع رغم الالتزام المستمر، أو إذا ترافق مع ألم ينتشر إلى إحدى الساقين أو تنميل أو وخز أو ضعف ملحوظ، فقد حان وقت استشارة أخصائي. فالتقييم المتخصص للعمود الفقري في هذه المرحلة يمكن أن يحدد السبب الكامن ويوجهك إلى العلاج الأنسب، سواء كان علاجًا تحفظيًا أو، في بعض الحالات، تدخلاً أكثر تحديدًا.",
    ],
  },
  "pituitary-tumor-symptoms": {
    read_time_en: "7 min read",
    read_time_ar: "7 دقائق قراءة",
    en: [
      "The pituitary gland is often called the body's 'master gland' — a structure no larger than a pea, sitting at the base of the brain, that regulates hormones controlling growth, metabolism, reproduction, and the body's response to stress. When a tumor develops in or around this gland, its effects can ripple across many different body systems, which is exactly why pituitary tumors are so often misunderstood or diagnosed only after a long journey through other specialists.",
      "The great majority of pituitary tumors are benign growths called adenomas, and many grow slowly over years. Some produce no hormones at all and are discovered incidentally on imaging done for unrelated reasons, while others actively secrete excess hormones, producing a distinct pattern of symptoms depending on which hormone is involved.",
      "When a tumor secretes excess prolactin, for example, it can lead to irregular or absent menstrual periods and unexpected milk production in women, and reduced libido or fertility difficulties in men. Tumors that produce excess growth hormone can gradually change the appearance of the hands, feet, and facial features over time, while those affecting cortisol regulation can contribute to weight changes, high blood pressure, and skin changes. Because these symptoms often develop gradually, they are easy to attribute to other causes.",
      "Beyond hormonal effects, a pituitary tumor can also produce symptoms simply through its physical size and location — what specialists call a 'mass effect.' A persistent headache, often felt behind or between the eyes, is common. Perhaps the most distinctive warning sign is a specific pattern of vision loss affecting the outer, peripheral fields of vision in both eyes, which occurs when the growing tumor presses on the optic chiasm, the point where the optic nerves cross just above the pituitary gland.",
      "Diagnosis typically combines a dedicated MRI scan of the pituitary region, blood tests to measure relevant hormone levels, and formal visual field testing when vision symptoms are present. Because pituitary tumors affect hormonal balance, care is usually coordinated between a neurosurgeon and an endocrinologist to build a complete picture before deciding on treatment.",
      "Treatment is not one-size-fits-all. Some prolactin-secreting tumors respond well to medication alone, sometimes avoiding the need for surgery entirely. For many other tumors — particularly those causing vision changes, significant mass effect, or hormone excess that doesn't respond to medication — surgery is recommended, and radiation therapy may be considered in select cases, either alone or alongside surgery.",
      "When surgery is needed, the endoscopic endonasal approach has become the standard technique for most pituitary tumors. Working through the nostrils with a high-definition endoscope and image guidance, the surgical team can reach the pituitary gland without any external incision or visible scar, typically resulting in a shorter hospital stay and faster recovery compared to older, more invasive approaches.",
      "After surgery, careful follow-up matters just as much as the procedure itself, including monitoring hormone levels, imaging to confirm the extent of tumor removal, and, when relevant, ongoing vision checks. If you have been experiencing unexplained changes in vision, persistent headaches, or hormonal symptoms that don't fit an obvious pattern, a thorough evaluation that includes pituitary imaging can be an important step toward finding an answer.",
    ],
    ar: [
      "تُعرف الغدة النخامية غالبًا بـ'الغدة الرئيسية' في الجسم، وهي تركيب لا يتجاوز حجم حبة البازلاء، يقع في قاعدة المخ، وينظم الهرمونات المسؤولة عن النمو والتمثيل الغذائي والإنجاب واستجابة الجسم للتوتر. وعندما ينمو ورم في هذه الغدة أو حولها، يمكن أن تمتد آثاره لتشمل أجهزة عديدة في الجسم، وهذا بالتحديد سبب كون أورام الغدة النخامية غالبًا ما يُساء فهمها أو لا يتم تشخيصها إلا بعد رحلة طويلة بين تخصصات طبية مختلفة.",
      "الغالبية العظمى من أورام الغدة النخامية هي أورام حميدة تُعرف بالأورام الغدية (Adenomas)، وكثير منها ينمو ببطء على مدار سنوات. بعضها لا يفرز أي هرمونات ويُكتشف مصادفة أثناء إجراء أشعة لأسباب أخرى، بينما يفرز البعض الآخر كميات زائدة من الهرمونات، مما ينتج عنه نمط مميز من الأعراض حسب الهرمون المتأثر.",
      "فعلى سبيل المثال، عندما يفرز الورم كمية زائدة من هرمون البرولاكتين، قد يؤدي ذلك إلى اضطراب أو انقطاع الدورة الشهرية وإفراز حليب غير متوقع لدى النساء، وانخفاض الرغبة الجنسية أو صعوبات في الإنجاب لدى الرجال. أما الأورام التي تفرز كمية زائدة من هرمون النمو فقد تغيّر تدريجيًا من شكل اليدين والقدمين وملامح الوجه مع الوقت، بينما تسهم الأورام المؤثرة على تنظيم الكورتيزول في تغيرات الوزن وارتفاع ضغط الدم وتغيرات الجلد. ولأن هذه الأعراض غالبًا ما تتطور تدريجيًا، فمن السهل نسبتها إلى أسباب أخرى.",
      "وبعيدًا عن التأثيرات الهرمونية، قد ينتج عن الورم النخامي أعراض ناتجة ببساطة عن حجمه وموقعه الفيزيائي، وهو ما يسميه المتخصصون 'تأثير الكتلة'. فالصداع المستمر، الذي غالبًا ما يُشعر به خلف العينين أو بينهما، شائع في هذه الحالة. ولعل أبرز علامة تحذيرية مميزة هي نمط محدد من فقدان البصر يؤثر على المجال البصري المحيطي الخارجي في كلتا العينين، ويحدث عندما يضغط الورم المتنامي على التصالب البصري، وهو النقطة التي يتقاطع فيها العصبان البصريان فوق الغدة النخامية مباشرة.",
      "يعتمد التشخيص عادة على الجمع بين رنين مغناطيسي مخصص لمنطقة الغدة النخامية، وفحوصات دم لقياس مستويات الهرمونات ذات الصلة، واختبار رسمي للمجال البصري عند وجود أعراض بصرية. ولأن أورام الغدة النخامية تؤثر على التوازن الهرموني، عادة ما تُنسّق الرعاية بين جراح الأعصاب وأخصائي الغدد الصماء لتكوين صورة كاملة قبل تحديد خطة العلاج.",
      "والعلاج ليس موحدًا لجميع الحالات؛ فبعض الأورام المفرزة للبرولاكتين تستجيب جيدًا للعلاج الدوائي وحده، مما قد يغني عن الجراحة تمامًا في بعض الأحيان. أما في حالات أخرى كثيرة، خاصة تلك المصحوبة بتغيرات بصرية أو تأثير كتلة كبير أو إفراز هرموني زائد لا يستجيب للدواء، فتكون الجراحة هي الموصى بها، وقد يُنظر في العلاج الإشعاعي في حالات مختارة، سواء بمفرده أو مصاحبًا للجراحة.",
      "وعند الحاجة للجراحة، أصبح المنظار عبر الأنف هو الأسلوب المعتمد لمعظم أورام الغدة النخامية؛ حيث يعمل الفريق الجراحي عبر فتحتي الأنف باستخدام منظار عالي الدقة وأنظمة التوجيه بالصور، ليصل إلى الغدة النخامية دون أي شق جراحي خارجي أو ندبة ظاهرة، مما يؤدي عادة إلى إقامة أقصر بالمستشفى وتعافٍ أسرع مقارنة بالأساليب التقليدية الأكثر توغلاً.",
      "وبعد الجراحة، تُعد المتابعة الدقيقة لا تقل أهمية عن العملية نفسها، وتشمل مراقبة مستويات الهرمونات، والتصوير للتأكد من مدى استئصال الورم، ومتابعة البصر عند الحاجة. فإذا كنت تعاني من تغيرات غير مبررة في الرؤية، أو صداع مستمر، أو أعراض هرمونية لا تتبع نمطًا واضحًا، فإن التقييم الشامل الذي يتضمن تصوير الغدة النخامية قد يكون خطوة مهمة نحو الوصول إلى إجابة.",
    ],
  },
  "cerebral-aneurysms-treatment": {
    read_time_en: "6 min read",
    read_time_ar: "6 دقائق قراءة",
    en: [
      "A cerebral aneurysm is a weakened, bulging area in the wall of a blood vessel within the brain, somewhat like a thin spot on an overinflated balloon. Most aneurysms cause no symptoms at all and many people live their entire lives without knowing they have one. The real concern lies in the possibility of rupture, which can lead to a serious type of brain bleed known as a subarachnoid hemorrhage — but the encouraging reality is that many unruptured aneurysms can be identified and, when appropriate, treated before that ever happens.",
      "Several factors are known to increase the likelihood of developing an aneurysm or having an existing one grow over time. These include high blood pressure, smoking, a family history of aneurysms, and certain inherited conditions that affect blood vessel walls. Aneurysms are also somewhat more common in women and tend to be diagnosed more often after middle age, though they can occur at any age.",
      "Because most unruptured aneurysms don't cause symptoms, many are discovered incidentally — for example, during a brain MRI or CT scan performed for an unrelated reason, such as evaluating headaches or after a minor head injury. For people with a strong family history of brain aneurysms, doctors may also recommend proactive screening imaging, since catching an aneurysm before it causes problems is far preferable to discovering it after a rupture.",
      "While many unruptured aneurysms are entirely silent, larger ones can sometimes press on nearby structures and cause symptoms such as a drooping eyelid, double vision, or pain located behind or above one eye. These symptoms deserve prompt medical attention, as they can signal that an aneurysm is growing or exerting pressure on surrounding nerves.",
      "It's worth briefly distinguishing this from a ruptured aneurysm, which typically causes a sudden, severe 'thunderclap' headache unlike anything experienced before — a true medical emergency requiring immediate care, which is discussed in more detail in our article on warning signs that require urgent neurosurgical attention.",
      "When an unruptured aneurysm is found, the decision about whether to treat it or monitor it closely is highly individualized. Neurosurgeons weigh several factors, including the aneurysm's size, shape, and exact location, whether it has grown on follow-up imaging, the patient's age and overall health, and personal risk factors such as smoking or uncontrolled blood pressure. Small, stable aneurysms in low-risk locations are often followed with periodic imaging rather than treated immediately.",
      "When treatment is recommended, two main approaches are available. Microsurgical clipping involves a craniotomy to place a small metal clip across the base of the aneurysm, permanently sealing it off from normal blood flow. Endovascular treatment, performed through a catheter inserted into a blood vessel rather than through an open incision, includes techniques such as coiling or the placement of a flow-diverting stent, which redirect blood flow away from the weakened area. The right approach depends on the aneurysm's specific characteristics and is decided jointly between the patient and the treating specialist.",
      "For aneurysms that are being monitored rather than treated immediately, regular follow-up imaging — along with active management of risk factors like blood pressure and smoking cessation — plays a central role in reducing the chance of growth or rupture over time. If you have risk factors for brain aneurysms or a family history of one, a conversation with a neurosurgeon about whether screening imaging is appropriate for you can provide valuable peace of mind.",
    ],
    ar: [
      "تمدد الأوعية الدموية الدماغية هو منطقة ضعيفة ومنتفخة في جدار أحد الأوعية الدموية داخل المخ، أشبه بنقطة رقيقة على بالون منفوخ بشدة. ومعظم هذه التمددات لا تسبب أي أعراض على الإطلاق، وكثير من الأشخاص يعيشون حياتهم كاملة دون أن يعلموا بوجودها. ويكمن القلق الحقيقي في احتمال انفجارها، مما قد يؤدي إلى نوع خطير من نزيف المخ يُعرف بالنزيف تحت العنكبوتية، لكن الواقع المُطمئن أن كثيرًا من هذه التمددات غير المنفجرة يمكن اكتشافها، وعند الحاجة علاجها، قبل حدوث ذلك.",
      "هناك عدة عوامل معروفة بأنها تزيد من احتمال تكوّن تمدد الأوعية الدموية أو نمو تمدد موجود بالفعل مع الوقت، من بينها ارتفاع ضغط الدم، والتدخين، ووجود تاريخ عائلي لتمددات الأوعية الدموية، وبعض الحالات الوراثية المؤثرة على جدران الأوعية الدموية. كما أن هذه التمددات أكثر شيوعًا نسبيًا لدى النساء، وتُشخَّص غالبًا بعد منتصف العمر، وإن كانت قد تحدث في أي عمر.",
      "ولأن معظم التمددات غير المنفجرة لا تسبب أعراضًا، فإن كثيرًا منها يُكتشف مصادفة، مثلاً أثناء إجراء رنين مغناطيسي أو أشعة مقطعية للمخ لسبب آخر، كتقييم صداع أو بعد إصابة بسيطة في الرأس. وبالنسبة للأشخاص ذوي التاريخ العائلي القوي لتمددات الأوعية الدماغية، قد يوصي الأطباء أيضًا بإجراء أشعة فحص استباقية، إذ إن اكتشاف التمدد قبل أن يسبب مشكلات أفضل بكثير من اكتشافه بعد الانفجار.",
      "ومع أن كثيرًا من التمددات غير المنفجرة صامتة تمامًا، فإن التمددات الأكبر حجمًا قد تضغط أحيانًا على التراكيب المجاورة وتسبب أعراضًا مثل تدلي الجفن أو ازدواج الرؤية أو ألم موضعه خلف إحدى العينين أو فوقها. وتستحق هذه الأعراض اهتمامًا طبيًا سريعًا، إذ قد تشير إلى نمو التمدد أو ضغطه على الأعصاب المحيطة به.",
      "ومن المفيد التمييز بإيجاز هنا بين هذا وبين تمدد الأوعية المنفجر، الذي يسبب عادة صداعًا صاعقيًا مفاجئًا وشديدًا لا يشبه أي شيء اختبره المريض من قبل، وهو حالة طارئة حقيقية تستدعي رعاية فورية، تناولناها بتفصيل أكبر في مقالنا عن العلامات التحذيرية التي تستدعي اهتمامًا عاجلاً من جراحة الأعصاب.",
      "وعند اكتشاف تمدد غير منفجر، فإن قرار علاجه أو متابعته عن كثب يكون فرديًا للغاية؛ إذ يزن جراحو الأعصاب عدة عوامل، منها حجم التمدد وشكله وموقعه الدقيق، وما إذا كان قد نما في الأشعة المتابعة، وعمر المريض وحالته الصحية العامة، وعوامل الخطر الشخصية كالتدخين أو ضغط الدم غير المنضبط. وغالبًا ما تُتابع التمددات الصغيرة المستقرة في مواقع منخفضة الخطورة بالأشعة الدورية بدلاً من علاجها فورًا.",
      "وعند التوصية بالعلاج، يتوفر أسلوبان رئيسيان؛ الأول هو 'القص الجراحي المجهري' الذي يتضمن فتحة جراحية لوضع مشبك معدني صغير عند قاعدة التمدد، يعزله بشكل دائم عن مجرى الدم الطبيعي. أما الثاني فهو العلاج داخل الأوعية الدموية، الذي يتم عبر قسطرة تُدخل في أحد الأوعية الدموية دون شق جراحي مفتوح، ويشمل تقنيات مثل الحشو باللفائف المعدنية أو زراعة دعامة موجّهة لتدفق الدم، تعمل على إعادة توجيه تدفق الدم بعيدًا عن المنطقة الضعيفة. ويعتمد اختيار الأسلوب الأنسب على خصائص التمدد المحددة، ويُقرر بالتشاور بين المريض والطبيب المعالج.",
      "أما بالنسبة للتمددات التي تُتابع دون علاج فوري، فتلعب الأشعة الدورية للمتابعة، إلى جانب الإدارة الفعالة لعوامل الخطر كضغط الدم والإقلاع عن التدخين، دورًا محوريًا في تقليل احتمال نموها أو انفجارها مع الوقت. فإذا كانت لديك عوامل خطر لتمددات الأوعية الدماغية أو تاريخ عائلي لها، فإن التحدث مع جراح أعصاب حول مدى ملاءمة إجراء أشعة فحص استباقية لحالتك قد يمنحك طمأنينة حقيقية.",
    ],
  },
  "refractory-epilepsy-surgery": {
    read_time_en: "7 min read",
    read_time_ar: "7 دقائق قراءة",
    en: [
      "Most people with epilepsy achieve good seizure control with medication alone. However, a meaningful proportion of patients continue to have seizures despite trying two or more appropriately chosen and adequately dosed anti-seizure medications — a situation specialists define as drug-resistant, or refractory, epilepsy. For these patients, surgery is not a last resort to be considered only after exhausting every other option over many years; it is a well-established treatment that is often most effective when considered earlier rather than later.",
      "Uncontrolled seizures carry real risks beyond the seizures themselves, including injury, effects on memory and cognitive function over time, limitations on driving and independence, and a significant impact on daily quality of life and emotional wellbeing. This is precisely why medical guidelines increasingly emphasize timely referral to a comprehensive epilepsy center once a patient meets the definition of drug-resistant epilepsy, rather than continuing to adjust medications indefinitely.",
      "Before any surgical option is considered, a thorough evaluation is essential. This typically includes video-EEG monitoring, during which a patient stays in a specialized unit while brain activity and behavior are recorded continuously to capture and precisely characterize their seizures. High-resolution MRI is used to look for any structural cause, such as a small area of scarring or a subtle malformation, and neuropsychological testing helps map cognitive strengths and identify any areas of vulnerability before treatment decisions are made.",
      "In more complex cases, where non-invasive tests don't clearly agree on where seizures begin, doctors may recommend intracranial EEG — temporarily placing electrodes directly on or within the brain to pinpoint the seizure onset zone with greater precision. This step, while more involved, can be essential for planning a safe and effective surgical approach.",
      "When seizures consistently arise from a single, well-defined area that can be safely removed, resective surgery — most commonly involving the temporal lobe, one of the best-studied and most successful areas for this type of surgery — aims to remove that specific region while preserving surrounding brain function. For well-selected patients, this approach offers a realistic chance of significant seizure reduction or complete seizure freedom.",
      "Not every patient is a candidate for resective surgery, particularly when seizures arise from an area responsible for critical functions like speech or movement, or when there isn't a single clear seizure focus. For these patients, several other options exist, including responsive neurostimulation and vagus nerve stimulation, which work by detecting or interrupting abnormal electrical activity, and in select cases, laser ablation, which can treat a small, precisely targeted area through a minimally invasive approach.",
      "Every one of these paths is decided through a multidisciplinary epilepsy team, typically including neurologists, neurosurgeons, neuropsychologists, and specialized nursing staff, who review the evaluation results together and discuss the realistic risks and expected benefits of each option directly with the patient and their family before any decision is made.",
      "If you or a loved one has continued to experience seizures despite trying two or more medications, it is worth having a direct conversation with a neurologist or neurosurgeon about referral for a comprehensive epilepsy evaluation. Earlier evaluation doesn't commit you to surgery — it simply ensures that if surgery or another advanced treatment could genuinely help, that option is identified and available to you as early as possible.",
    ],
    ar: [
      "يحقق معظم مرضى الصرع تحكمًا جيدًا في نوباتهم بالعلاج الدوائي وحده. إلا أن نسبة معتبرة من المرضى تستمر لديهم النوبات رغم تجربة دواءين أو أكثر من الأدوية المضادة للصرع المختارة بعناية وبالجرعة المناسبة، وهي الحالة التي يُطلق عليها المتخصصون 'الصرع المقاوم للأدوية' أو 'الصرع المستعصي'. وبالنسبة لهؤلاء المرضى، لا تُعد الجراحة خيارًا أخيرًا يُلجأ إليه فقط بعد استنفاد كل الخيارات الأخرى على مدار سنوات طويلة، بل هي علاج ثابت الفعالية غالبًا ما يكون أكثر نجاحًا كلما تم النظر فيه مبكرًا.",
      "تحمل النوبات غير المسيطر عليها مخاطر حقيقية تتجاوز النوبة نفسها، منها احتمال الإصابة، والتأثير على الذاكرة والوظائف الإدراكية مع الوقت، والقيود المفروضة على القيادة والاستقلالية، بالإضافة إلى تأثير كبير على جودة الحياة اليومية والصحة النفسية. ولهذا السبب بالتحديد تؤكد الإرشادات الطبية بشكل متزايد على أهمية الإحالة في الوقت المناسب إلى مركز متخصص شامل لعلاج الصرع بمجرد استيفاء تعريف الصرع المقاوم للأدوية، بدلاً من الاستمرار في تعديل الأدوية إلى أجل غير مسمى.",
      "وقبل النظر في أي خيار جراحي، يُعد التقييم الشامل أمرًا أساسيًا؛ ويشمل ذلك عادة مراقبة الفيديو والرسم الكهربائي للمخ (Video-EEG)، حيث يمكث المريض في وحدة متخصصة بينما يُسجَّل نشاط المخ وسلوكه باستمرار لرصد النوبات وتوصيفها بدقة. كما يُستخدم الرنين المغناطيسي عالي الدقة للبحث عن أي سبب تركيبي، كمنطقة تندب صغيرة أو تشوه طفيف، بينما يساعد الاختبار النفسي العصبي في رسم خريطة لنقاط القوة الإدراكية وتحديد أي مناطق حساسة قبل اتخاذ قرارات العلاج.",
      "وفي الحالات الأكثر تعقيدًا، حيث لا تتفق الفحوصات غير التوغلية بوضوح على مكان بدء النوبات، قد يوصي الأطباء بإجراء تخطيط كهربائي داخل الجمجمة، عبر وضع أقطاب كهربائية مؤقتة على سطح المخ أو داخله لتحديد منطقة بدء النوبة بدقة أكبر. وهذه الخطوة، وإن كانت أكثر تعقيدًا، قد تكون ضرورية للتخطيط لأسلوب جراحي آمن وفعال.",
      "وعندما تنشأ النوبات باستمرار من منطقة واحدة محددة بوضوح يمكن استئصالها بأمان، تهدف 'جراحة الاستئصال'، والتي غالبًا ما تشمل الفص الصدغي أحد أكثر مناطق هذا النوع من الجراحة دراسة ونجاحًا، إلى إزالة تلك المنطقة تحديدًا مع الحفاظ على وظائف المخ المحيطة بها. وبالنسبة للمرضى المختارين بعناية، يوفر هذا الأسلوب فرصة حقيقية لتقليل النوبات بشكل كبير أو التخلص منها تمامًا.",
      "وليس كل مريض مرشحًا لجراحة الاستئصال، خاصة عندما تنشأ النوبات من منطقة مسؤولة عن وظائف حيوية كالكلام أو الحركة، أو عندما لا توجد بؤرة واحدة واضحة للنوبة. وبالنسبة لهؤلاء المرضى، تتوفر عدة خيارات أخرى، منها التنبيه العصبي التفاعلي وتنبيه العصب المبهم، اللذان يعملان عبر رصد أو مقاطعة النشاط الكهربائي غير الطبيعي، وفي حالات مختارة الاستئصال بالليزر، الذي يمكنه علاج منطقة صغيرة ومحددة بدقة من خلال أسلوب طفيف التوغل.",
      "ويُتخذ القرار في كل مسار من هذه المسارات من خلال فريق متعدد التخصصات لعلاج الصرع، يضم عادة أخصائيي مخ وأعصاب وجراحي أعصاب وأخصائيين نفسيين عصبيين وطاقم تمريض متخصص، يراجعون معًا نتائج التقييم ويناقشون المخاطر الواقعية والفوائد المتوقعة لكل خيار مباشرة مع المريض وأسرته قبل اتخاذ أي قرار.",
      "فإذا كنت أنت أو أحد أفراد أسرتك تستمر لديه النوبات رغم تجربة دواءين أو أكثر، فمن المفيد إجراء حوار مباشر مع أخصائي مخ وأعصاب أو جراح أعصاب حول الإحالة لتقييم شامل للصرع. فالتقييم المبكر لا يُلزمك بالجراحة، بل يضمن فقط أنه إذا كانت الجراحة أو أي علاج متقدم آخر قد يفيدك حقًا، فسيتم تحديد هذا الخيار وإتاحته لك في أقرب وقت ممكن.",
    ],
  },
};

async function replaceArticle(articleId, slug) {
  const data = CONTENT[slug];
  if (!data) throw new Error(`No content drafted for slug: ${slug}`);
  if (data.en.length !== 8 || data.ar.length !== 8) {
    throw new Error(`${slug}: expected 8 paragraphs per locale, got en=${data.en.length} ar=${data.ar.length}`);
  }

  const { data: article, error: fetchError } = await supabase
    .from("content_items")
    .select("meta")
    .eq("id", articleId)
    .single();
  if (fetchError) throw fetchError;

  const { error: deleteError } = await supabase.from("content_items").delete().eq("parent_id", articleId);
  if (deleteError) throw deleteError;

  const rows = data.en.map((_, index) => ({
    section_id: SECTION_ID,
    parent_id: articleId,
    item_type: "paragraph",
    text_en: data.en[index],
    text_ar: data.ar[index],
    order_index: index,
    meta: {},
  }));
  const { error: insertError } = await supabase.from("content_items").insert(rows);
  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("content_items")
    .update({
      meta: { ...article.meta, read_time_en: data.read_time_en, read_time_ar: data.read_time_ar },
    })
    .eq("id", articleId);
  if (updateError) throw updateError;

  console.log(`✓ ${slug} — 8 paragraphs, read_time updated to "${data.read_time_en}" / "${data.read_time_ar}"`);
}

async function main() {
  for (const [articleId, slug] of Object.entries(ARTICLES)) {
    await replaceArticle(articleId, slug);
  }
  console.log("\nDone. All 7 articles now have full-length bilingual content.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
