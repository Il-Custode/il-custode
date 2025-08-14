// assets/js/i18n.js
(function () {
  const LS_LANG_KEY   = 'custode.lang';
  const LS_SB_URL_KEY = 'custode.sb.url';
  const LS_SB_KEY_KEY = 'custode.sb.anon';
  let currentLang     = 'it';

  // ===== Dizionari per Welcome / Login(Menu) / Settings in tutte le lingue del selettore =====
  const DICT = {
    it: {
      common: { back:"⬅ Indietro", logout:"Logout", connected_as:"Connesso come:" },
      welcome: {
        page_title:"Il Custode — Benvenuto",
        enter:"Entra",
        // --- LE 10 FRASI ORIGINALI DELLA WELCOME (riprese dal tuo file) ---
        greetings: [
          "Chi bussa alla Porta del Custode? Ah, sei tu. Benvenuto. Lascia che illumini la tua vita.",
          "Io sono il Custode. Entra pure: il fuoco è acceso e le mappe attendono la tua mano.",
          "Benvenuto, viandante. Il Custode veglia: attraversa la soglia e lascia che l’avventura ti trovi.",
          "Sei giunto fin qui: onore a te. Io sono il Custode, e il sentiero ora si rischiara.",
          "Bussa forte e senza timore: il Custode ascolta. Entra, prendi posto, agisci.",
          "Ah, un volto nuovo! Benvenuto nelle mie sale. Io sono il Custode: guida e testimone dei tuoi passi.",
          "Gli astri ti hanno condotto: benvenuto. Varca la soglia, entra nel cerchio e dai inizio all’opera.",
          "La pergamena si srotola per te. Io sono il Custode: è tempo di scrivere la tua leggenda.",
          "Sento la tua presenza. Entra, amico: la notte è lunga e le storie chiedono voce.",
          "Hai bussato con coraggio. Benvenuto. Io sono il Custode: apri il libro, scegli il capitolo, agisci."
        ]
      },
      home: {
        page_title:"Il Custode — Home",
        header:"Il Custode — Home",
        header_connected:"Connesso: ",
        choose:"Seleziona una sezione",
        wizard_title:"Il Custode ti osserva",
        // --- Le 10 FRASI “di login” (pagina 2) ---
        greetings:[
          "Prima di entrare nel Salone, lascia il tuo nome sulla pergamena.",
          "Il fuoco è acceso. Identifica il tuo sigillo e siediti al tavolo.",
          "Scrivi le tue credenziali: le mappe non attendono i ritardatari.",
          "Dimmi chi sei e ti indicherò la stanza giusta: Master o Viandante?",
          "La chiave è semplice: una parola, una formula (la tua password).",
          "Chi entra senza bussare sveglia i draghi. Meglio autenticarsi, vero?",
          "Ogni storia inizia con un segno d’inchiostro: email e password.",
          "Se cerchi la Sala delle Mappe, occorre passare dal Custode.",
          "I tuoi passi sono sicuri qui, purché tu sia riconosciuto.",
          "Apri la porta con le parole giuste: poi scegli il tuo cammino."
        ],
        login:{
          title:"Accedi",
          email:"Email",
          password:"Password",
          remember:"Ricordami su questo dispositivo",
          signin:"Entra",
          signup:"Registrati",
          status:{
            fill_both:"Inserisci email e password.",
            signing_in:"Accesso in corso…",
            error_login_prefix:"Errore login: ",
            registering:"Registrazione…",
            error_signup_prefix:"Errore registrazione: ",
            registered:"Registrato! Controlla l’email e poi accedi.",
            ok:"Login riuscito."
          }
        },
        master:{
          title:"🎩 Modalità Master",
          desc:"Pannello del Master (campagne, strumenti).",
          btn:"Entra come Master"
        },
        player:{
          title:"🧝‍♂️ Modalità Giocatore",
          desc:"Connessione alla sessione (MVP).",
          btn:"Entra come Giocatore"
        },
        settings:{
          title:"⚙️ Impostazioni",
          desc:"Preferenze e configurazione dell’app.",
          btn:"Apri Impostazioni"
        },
        hub:{
          title:"📣 Community Hub",
          desc:"Condividi mappe, mostri, quest e idee.",
          btn:"Apri Hub"
        }
      },
      settings:{
        title:"Impostazioni",
        language:{ title:"Lingua", choose:"Scegli la tua lingua", apply:"Applica lingua", applied:"Lingua applicata" }
      }
    },

    en: {
      common: { back:"⬅ Back", logout:"Logout", connected_as:"Signed in as:" },
      welcome: {
        page_title:"The Custodian — Welcome",
        enter:"Enter",
        greetings:[
          "Welcome, wanderer. The Custodian keeps watch—step in and rest a moment.",
          "The parchment unrolls for you: tales and signs await beyond the threshold.",
          "Your name is the key—speak it softly and enter."
        ]
      },
      home: {
        page_title:"The Custodian — Home",
        header:"The Custodian — Home",
        header_connected:"Signed in: ",
        choose:"Choose a section",
        wizard_title:"The Custodian is watching you",
        greetings:[
          "Before you enter, sign the parchment with your name.",
          "The fire is lit: email and password, then take your seat.",
          "Speak the right words and the door will open."
        ],
        login:{
          title:"Sign in",
          email:"Email",
          password:"Password",
          remember:"Remember me on this device",
          signin:"Sign in",
          signup:"Sign up",
          status:{
            fill_both:"Enter email and password.",
            signing_in:"Signing in…",
            error_login_prefix:"Login error: ",
            registering:"Registering…",
            error_signup_prefix:"Signup error: ",
            registered:"Registered! Check your email, then sign in.",
            ok:"Signed in."
          }
        },
        master:{
          title:"🎩 Master Mode",
          desc:"Master panel (campaigns, tools).",
          btn:"Enter as Master"
        },
        player:{
          title:"🧝‍♂️ Player Mode",
          desc:"Connect to a session (MVP).",
          btn:"Enter as Player"
        },
        settings:{
          title:"⚙️ Settings",
          desc:"App preferences and configuration.",
          btn:"Open Settings"
        },
        hub:{
          title:"📣 Community Hub",
          desc:"Share maps, monsters, quests and ideas.",
          btn:"Open Hub"
        }
      },
      settings:{
        title:"Settings",
        language:{ title:"Language", choose:"Choose your language", apply:"Apply language", applied:"Language applied" }
      }
    },

    de: {
      common:{ back:"⬅ Zurück", logout:"Abmelden", connected_as:"Angemeldet als:" },
      welcome:{
        page_title:"Der Hüter — Willkommen",
        enter:"Eintreten",
        greetings:[
          "Willkommen, Wanderer. Der Hüter wacht – tritt ein und ruhe kurz.",
          "Die Pergamentrolle öffnet sich dir: Geschichten jenseits der Schwelle.",
          "Dein Name ist der Schlüssel – sprich ihn leise und tritt ein."
        ]
      },
      home:{
        page_title:"Der Hüter — Start",
        header:"Der Hüter — Start",
        header_connected:"Angemeldet: ",
        choose:"Wähle einen Bereich",
        wizard_title:"Der Hüter beobachtet dich",
        greetings:[
          "Bevor du eintrittst, setze deinen Namen aufs Pergament.",
          "Das Feuer brennt: E-Mail und Passwort, dann nimm Platz.",
          "Sprich die rechten Worte und die Tür öffnet sich."
        ],
        login:{
          title:"Anmelden",
          email:"E-Mail",
          password:"Passwort",
          remember:"Auf diesem Gerät merken",
          signin:"Anmelden",
          signup:"Registrieren",
          status:{
            fill_both:"E-Mail und Passwort eingeben.",
            signing_in:"Anmeldung…",
            error_login_prefix:"Anmeldefehler: ",
            registering:"Registrierung…",
            error_signup_prefix:"Registrierungsfehler: ",
            registered:"Registriert! Prüfe deine E-Mail und melde dich an.",
            ok:"Angemeldet."
          }
        },
        master:{ title:"🎩 Spielleiter-Modus", desc:"Panel für den Spielleiter (Kampagnen, Tools).", btn:"Als Spielleiter eintreten" },
        player:{ title:"🧝‍♂️ Spieler-Modus",    desc:"Mit einer Sitzung verbinden (MVP).",          btn:"Als Spieler eintreten" },
        settings:{ title:"⚙️ Einstellungen",   desc:"App-Einstellungen und Konfiguration.",        btn:"Einstellungen öffnen" },
        hub:{ title:"📣 Community-Hub",        desc:"Karten, Monster, Quests und Ideen teilen.",    btn:"Hub öffnen" }
      },
      settings:{ title:"Einstellungen", language:{ title:"Sprache", choose:"Sprache wählen", apply:"Sprache anwenden", applied:"Sprache angewendet" } }
    },

    fr:{
      common:{ back:"⬅ Retour", logout:"Déconnexion", connected_as:"Connecté en tant que :" },
      welcome:{
        page_title:"Le Gardien — Bienvenue",
        enter:"Entrer",
        greetings:[
          "Bienvenue, voyageur. Le Gardien veille — entre et repose-toi.",
          "Le parchemin se déroule pour toi : des récits au-delà du seuil.",
          "Ton nom est la clé — prononce-le doucement et entre."
        ]
      },
      home:{
        page_title:"Le Gardien — Accueil",
        header:"Le Gardien — Accueil",
        header_connected:"Connecté : ",
        choose:"Choisis une section",
        wizard_title:"Le Gardien t’observe",
        greetings:[
          "Avant d’entrer, inscris ton nom sur le parchemin.",
          "Le feu brûle : e-mail et mot de passe, puis assieds-toi.",
          "Dis les bons mots, la porte s’ouvrira."
        ],
        login:{
          title:"Connexion",
          email:"E-mail",
          password:"Mot de passe",
          remember:"Se souvenir de moi sur cet appareil",
          signin:"Se connecter",
          signup:"S’inscrire",
          status:{
            fill_both:"Entre l’e-mail et le mot de passe.",
            signing_in:"Connexion…",
            error_login_prefix:"Erreur de connexion : ",
            registering:"Inscription…",
            error_signup_prefix:"Erreur d’inscription : ",
            registered:"Inscrit ! Vérifie ton e-mail, puis connecte-toi.",
            ok:"Connecté."
          }
        },
        master:{ title:"🎩 Mode MJ",            desc:"Panneau du Maître du Jeu (campagnes, outils).", btn:"Entrer comme MJ" },
        player:{ title:"🧝‍♂️ Mode Joueur",      desc:"Se connecter à une session (MVP).",             btn:"Entrer comme Joueur" },
        settings:{ title:"⚙️ Paramètres",       desc:"Préférences et configuration de l’app.",        btn:"Ouvrir Paramètres" },
        hub:{ title:"📣 Hub Communauté",        desc:"Partage de cartes, monstres, quêtes et idées.", btn:"Ouvrir le Hub" }
      },
      settings:{ title:"Paramètres", language:{ title:"Langue", choose:"Choisis ta langue", apply:"Appliquer", applied:"Langue appliquée" } }
    },

    es:{
      common:{ back:"⬅ Atrás", logout:"Cerrar sesión", connected_as:"Conectado como:" },
      welcome:{
        page_title:"El Custodio — Bienvenida",
        enter:"Entrar",
        greetings:[
          "Bienvenido, viajero. El Custodio vela: entra y descansa.",
          "El pergamino se despliega: historias te esperan más allá del umbral.",
          "Tu nombre es la llave — dilo en voz baja y entra."
        ]
      },
      home:{
        page_title:"El Custodio — Inicio",
        header:"El Custodio — Inicio",
        header_connected:"Conectado: ",
        choose:"Elige una sección",
        wizard_title:"El Custodio te observa",
        greetings:[
          "Antes de entrar, firma el pergamino con tu nombre.",
          "El fuego está encendido: correo y contraseña, luego siéntate.",
          "Di las palabras correctas y la puerta se abrirá."
        ],
        login:{
          title:"Iniciar sesión",
          email:"Correo",
          password:"Contraseña",
          remember:"Recordarme en este dispositivo",
          signin:"Entrar",
          signup:"Registrarse",
          status:{
            fill_both:"Introduce correo y contraseña.",
            signing_in:"Accediendo…",
            error_login_prefix:"Error de inicio: ",
            registering:"Registrando…",
            error_signup_prefix:"Error de registro: ",
            registered:"¡Registrado! Revisa tu correo y luego inicia sesión.",
            ok:"Sesión iniciada."
          }
        },
        master:{ title:"🎩 Modo Máster",       desc:"Panel del Máster (campañas, herramientas).", btn:"Entrar como Máster" },
        player:{ title:"🧝‍♂️ Modo Jugador",     desc:"Conectarse a una sesión (MVP).",             btn:"Entrar como Jugador" },
        settings:{ title:"⚙️ Configuración",    desc:"Preferencias y configuración de la app.",    btn:"Abrir Configuración" },
        hub:{ title:"📣 Centro de la comunidad",desc:"Comparte mapas, monstruos, misiones e ideas.",btn:"Abrir Hub" }
      },
      settings:{ title:"Configuración", language:{ title:"Idioma", choose:"Elige tu idioma", apply:"Aplicar idioma", applied:"Idioma aplicado" } }
    },

    "pt-BR":{
      common:{ back:"⬅ Voltar", logout:"Sair", connected_as:"Conectado como:" },
      welcome:{
        page_title:"O Guardião — Boas-vindas",
        enter:"Entrar",
        greetings:[
          "Bem-vindo, viajante. O Guardião vigia — entre e descanse.",
          "O pergaminho se desenrola para você: histórias além do umbral.",
          "Seu nome é a chave — diga-o baixinho e entre."
        ]
      },
      home:{
        page_title:"O Guardião — Início",
        header:"O Guardião — Início",
        header_connected:"Conectado: ",
        choose:"Escolha uma seção",
        wizard_title:"O Guardião está observando você",
        greetings:[
          "Antes de entrar, assine o pergaminho com seu nome.",
          "O fogo está aceso: e-mail e senha, depois sente-se.",
          "Diga as palavras certas e a porta se abrirá."
        ],
        login:{
          title:"Entrar",
          email:"E-mail",
          password:"Senha",
          remember:"Lembrar neste dispositivo",
          signin:"Entrar",
          signup:"Cadastrar-se",
          status:{
            fill_both:"Informe e-mail e senha.",
            signing_in:"Conectando…",
            error_login_prefix:"Erro de login: ",
            registering:"Cadastrando…",
            error_signup_prefix:"Erro de cadastro: ",
            registered:"Cadastrado! Verifique o e-mail e depois entre.",
            ok:"Conectado."
          }
        },
        master:{ title:"🎩 Modo Mestre",    desc:"Painel do Mestre (campanhas, ferramentas).", btn:"Entrar como Mestre" },
        player:{ title:"🧝‍♂️ Modo Jogador", desc:"Conectar a uma sessão (MVP).",              btn:"Entrar como Jogador" },
        settings:{ title:"⚙️ Configurações",desc:"Preferências e configuração do app.",       btn:"Abrir Configurações" },
        hub:{ title:"📣 Hub da Comunidade", desc:"Compartilhe mapas, monstros, quests e ideias.", btn:"Abrir Hub" }
      },
      settings:{ title:"Configurações", language:{ title:"Idioma", choose:"Escolha seu idioma", apply:"Aplicar idioma", applied:"Idioma aplicado" } }
    },

    ja:{
      common:{ back:"⬅ 戻る", logout:"ログアウト", connected_as:"サインイン：" },
      welcome:{
        page_title:"管理者 — ようこそ",
        enter:"入る",
        greetings:[
          "ようこそ旅人よ。管理者は見守っている—中へどうぞ。",
          "巻物があなたのために開く。閾の向こうに物語がある。",
          "あなたの名こそ鍵。そっと告げ、内へ入れ。"
        ]
      },
      home:{
        page_title:"管理者 — ホーム",
        header:"管理者 — ホーム",
        header_connected:"サインイン：",
        choose:"セクションを選択",
        wizard_title:"管理者はあなたを見ている",
        greetings:[
          "入る前に、巻物に名を記しなさい。",
          "炉は燃えている。メールとパスワードを。",
          "正しい言葉を告げれば扉は開く。"
        ],
        login:{
          title:"サインイン",
          email:"メール",
          password:"パスワード",
          remember:"この端末で記憶する",
          signin:"サインイン",
          signup:"登録",
          status:{
            fill_both:"メールとパスワードを入力してください。",
            signing_in:"サインイン中…",
            error_login_prefix:"ログインエラー：",
            registering:"登録中…",
            error_signup_prefix:"登録エラー：",
            registered:"登録完了！メール確認後にサインイン。",
            ok:"サインインしました。"
          }
        },
        master:{ title:"🎩 ゲームマスターモード", desc:"GM用パネル（キャンペーン、ツール）。", btn:"マスターとして入る" },
        player:{ title:"🧝‍♂️ プレイヤーモード",    desc:"セッションに接続（MVP）。",             btn:"プレイヤーとして入る" },
        settings:{ title:"⚙️ 設定",               desc:"アプリの設定と構成。",                   btn:"設定を開く" },
        hub:{ title:"📣 コミュニティハブ",         desc:"マップ・モンスター・クエスト・アイデアを共有。", btn:"ハブを開く" }
      },
      settings:{ title:"設定", language:{ title:"言語", choose:"言語を選択", apply:"言語を適用", applied:"適用しました" } }
    },

    "zh-Hans":{
      common:{ back:"⬅ 返回", logout:"登出", connected_as:"登录为：" },
      welcome:{
        page_title:"守护者 — 欢迎",
        enter:"进入",
        greetings:[
          "欢迎，旅人。守护者守望着你——请进休息片刻。",
          "卷轴为你展开：门槛之外尽是故事。",
          "你的名字就是钥匙——轻声道出并进入。"
        ]
      },
      home:{
        page_title:"守护者 — 首页",
        header:"守护者 — 首页",
        header_connected:"已登录：",
        choose:"选择一个板块",
        wizard_title:"守护者正注视着你",
        greetings:[
          "进门之前，请在羊皮卷上写下你的名字。",
          "炉火正旺：输入邮箱与密码，然后就座。",
          "说出正确的话语，门便会开启。"
        ],
        login:{
          title:"登录",
          email:"邮箱",
          password:"密码",
          remember:"在此设备上记住我",
          signin:"登录",
          signup:"注册",
          status:{
            fill_both:"请输入邮箱和密码。",
            signing_in:"登录中…",
            error_login_prefix:"登录错误：",
            registering:"注册中…",
            error_signup_prefix:"注册错误：",
            registered:"已注册！请查收邮箱后登录。",
            ok:"已登录。"
          }
        },
        master:{ title:"🎩 主持人模式", desc:"主持人面板（战役、工具）。", btn:"以主持人身份进入" },
        player:{ title:"🧝‍♂️ 玩家模式",  desc:"连接至会话（MVP）。",       btn:"以玩家身份进入" },
        settings:{ title:"⚙️ 设置",      desc:"应用偏好与配置。",          btn:"打开设置" },
        hub:{ title:"📣 社区中心",       desc:"分享地图、怪物、任务与创意。", btn:"打开社区" }
      },
      settings:{ title:"设置", language:{ title:"语言", choose:"选择你的语言", apply:"应用语言", applied:"已应用" } }
    },

    ar:{
      common:{ back:"⬅ رجوع", logout:"تسجيل الخروج", connected_as:"مسجّل باسم:" },
      welcome:{
        page_title:"القيّم — أهلاً بك",
        enter:"ادخل",
        greetings:[
          "مرحباً أيها المسافر. القيّم يراقب — تفضّل واسترح.",
          "تُفرد الرقعة لك: حكايات وراء العتبة.",
          "اسمك هو المفتاح — همس به وادخل."
        ]
      },
      home:{
        page_title:"القيّم — الرئيسية",
        header:"القيّم — الرئيسية",
        header_connected:"مسجّل: ",
        choose:"اختر قسماً",
        wizard_title:"القيّم يراقبك",
        greetings:[
          "قبل الدخول، اكتب اسمك على الرق.",
          "النار موقدة: البريد وكلمة السر، ثم اجلس.",
          "قل الكلمات الصحيحة فتُفتح لك البوابة."
        ],
        login:{
          title:"تسجيل الدخول",
          email:"البريد الإلكتروني",
          password:"كلمة السر",
          remember:"تذكرني على هذا الجهاز",
          signin:"دخول",
          signup:"تسجيل",
          status:{
            fill_both:"أدخل البريد وكلمة السر.",
            signing_in:"جارٍ الدخول…",
            error_login_prefix:"خطأ تسجيل: ",
            registering:"جارٍ التسجيل…",
            error_signup_prefix:"خطأ التسجيل: ",
            registered:"تم التسجيل! افحص بريدك ثم سجّل الدخول.",
            ok:"تم الدخول."
          }
        },
        master:{ title:"🎩 وضع المدير",   desc:"لوحة المدير (الحملات والأدوات).", btn:"الدخول كمدير" },
        player:{ title:"🧝‍♂️ وضع اللاعب", desc:"الاتصال بجلسة (MVP).",          btn:"الدخول كلاعب" },
        settings:{ title:"⚙️ الإعدادات",  desc:"تفضيلات التطبيق وإعداده.",      btn:"فتح الإعدادات" },
        hub:{ title:"📣 مركز المجتمع",    desc:"شارك الخرائط والوحوش والمهام والأفكار.", btn:"فتح المركز" }
      },
      settings:{ title:"الإعدادات", language:{ title:"اللغة", choose:"اختر لغتك", apply:"تطبيق اللغة", applied:"تم التطبيق" } }
    },

    ru:{
      common:{ back:"⬅ Назад", logout:"Выйти", connected_as:"Вошли как:" },
      welcome:{
        page_title:"Хранитель — Добро пожаловать",
        enter:"Войти",
        greetings:[
          "Добро пожаловать, путник. Хранитель наблюдает — входи и отдохни.",
          "Пергамент разворачивается для тебя: истории за порогом.",
          "Твоё имя — ключ — прошепчи его и входи."
        ]
      },
      home:{
        page_title:"Хранитель — Главная",
        header:"Хранитель — Главная",
        header_connected:"Вход: ",
        choose:"Выбери раздел",
        wizard_title:"Хранитель наблюдает за тобой",
        greetings:[
          "Перед входом подпиши пергамент своим именем.",
          "Огонь горит: e-mail и пароль — садись.",
          "Скажи верные слова — дверь откроется."
        ],
        login:{
          title:"Вход",
          email:"E-mail",
          password:"Пароль",
          remember:"Запомнить на этом устройстве",
          signin:"Войти",
          signup:"Зарегистрироваться",
          status:{
            fill_both:"Введите e-mail и пароль.",
            signing_in:"Входим…",
            error_login_prefix:"Ошибка входа: ",
            registering:"Регистрация…",
            error_signup_prefix:"Ошибка регистрации: ",
            registered:"Зарегистрировано! Проверьте почту и войдите.",
            ok:"Выполнен вход."
          }
        },
        master:{ title:"🎩 Режим Мастера",  desc:"Панель Мастера (кампании, инструменты).", btn:"Войти как Мастер" },
        player:{ title:"🧝‍♂️ Режим Игрока",  desc:"Подключиться к сессии (MVP).",            btn:"Войти как Игрок" },
        settings:{ title:"⚙️ Настройки",     desc:"Параметры и конфигурация приложения.",    btn:"Открыть настройки" },
        hub:{ title:"📣 Центр сообщества",   desc:"Делитесь картами, монстрами, квестами и идеями.", btn:"Открыть хаб" }
      },
      settings:{ title:"Настройки", language:{ title:"Язык", choose:"Выберите язык", apply:"Применить", applied:"Применено" } }
    },

    hi:{
      common:{ back:"⬅ वापस", logout:"लॉगआउट", connected_as:"के रूप में साइन इन:" },
      welcome:{
        page_title:"संरक्षक — स्वागत",
        enter:"अंदर जाएँ",
        greetings:[
          "स्वागत है, यात्री। संरक्षक देख रहा है — भीतर आओ और विश्राम करो।",
          "पत्र तुम्हारे लिए खुलता है: दहलीज़ के पार कथाएँ हैं।",
          "तुम्हारा नाम ही कुंजी है — धीरे से कहो और प्रवेश करो।"
        ]
      },
      home:{
        page_title:"संरक्षक — मुखपृष्ठ",
        header:"संरक्षक — मुखपृष्ठ",
        header_connected:"साइन इन: ",
        choose:"एक अनुभाग चुनें",
        wizard_title:"संरक्षक तुम्हें देख रहा है",
        greetings:[
          "अंदर जाने से पहले अपना नाम लिखो।",
          "अंगार जल रहा है: ईमेल और पासवर्ड, फिर बैठो।",
          "सही शब्द कहो और द्वार खुल जाएगा।"
        ],
        login:{
          title:"साइन इन",
          email:"ईमेल",
          password:"पासवर्ड",
          remember:"इस डिवाइस पर याद रखें",
          signin:"साइन इन",
          signup:"साइन अप",
          status:{
            fill_both:"ईमेल और पासवर्ड दर्ज करें।",
            signing_in:"साइन इन हो रहा है…",
            error_login_prefix:"लॉगिन त्रुटि: ",
            registering:"पंजीकरण…",
            error_signup_prefix:"साइन-अप त्रुटि: ",
            registered:"पंजीकृत! ईमेल जाँचें, फिर साइन इन करें।",
            ok:"साइन इन हो गया।"
          }
        },
        master:{ title:"🎩 मास्टर मोड",   desc:"मास्टर पैनल (कैंपेन, टूल्स)।",     btn:"मास्टर के रूप में प्रवेश" },
        player:{ title:"🧝‍♂️ खिलाड़ी मोड", desc:"सेशन से कनेक्ट करें (MVP)।",        btn:"खिलाड़ी के रूप में प्रवेश" },
        settings:{ title:"⚙️ सेटिंग्स",    desc:"ऐप प्राथमिकताएँ और कॉन्फ़िगरेशन।", btn:"सेटिंग्स खोलें" },
        hub:{ title:"📣 समुदाय हब",        desc:"मानचित्र, राक्षस, क्वेस्ट और आइडिया साझा करें।", btn:"हब खोलें" }
      },
      settings:{ title:"सेटिंग्स", language:{ title:"भाषा", choose:"अपनी भाषा चुनें", apply:"भाषा लागू करें", applied:"लागू किया गया" } }
    },

    ko:{
      common:{ back:"⬅ 뒤로", logout:"로그아웃", connected_as:"로그인 계정:" },
      welcome:{
        page_title:"관리자 — 환영합니다",
        enter:"입장",
        greetings:[
          "환영합니다, 여행자여. 관리자가 지켜봅니다 — 들어와 쉬세요.",
          "당신을 위한 두루마리가 펼쳐집니다. 문턱 너머에 이야기가 있습니다.",
          "당신의 이름이 열쇠입니다 — 속삭이고 들어오세요."
        ]
      },
      home:{
        page_title:"관리자 — 홈",
        header:"관리자 — 홈",
        header_connected:"로그인: ",
        choose:"섹션 선택",
        wizard_title:"관리자가 당신을 지켜보고 있습니다",
        greetings:[
          "들어오기 전에 두루마리에 이름을 적으세요.",
          "불이 피었습니다: 이메일과 비밀번호를 입력하세요.",
          "올바른 말을 하면 문이 열립니다."
        ],
        login:{
          title:"로그인",
          email:"이메일",
          password:"비밀번호",
          remember:"이 기기에서 기억하기",
          signin:"로그인",
          signup:"가입",
          status:{
            fill_both:"이메일과 비밀번호를 입력하세요.",
            signing_in:"로그인 중…",
            error_login_prefix:"로그인 오류: ",
            registering:"가입 중…",
            error_signup_prefix:"가입 오류: ",
            registered:"가입 완료! 이메일 확인 후 로그인하세요.",
            ok:"로그인되었습니다."
          }
        },
        master:{ title:"🎩 마스터 모드",   desc:"마스터 패널(캠페인, 도구).",     btn:"마스터로 입장" },
        player:{ title:"🧝‍♂️ 플레이어 모드", desc:"세션에 연결(MVP).",            btn:"플레이어로 입장" },
        settings:{ title:"⚙️ 설정",        desc:"앱 환경설정 및 구성.",           btn:"설정 열기" },
        hub:{ title:"📣 커뮤니티 허브",     desc:"지도, 몬스터, 퀘스트, 아이디어 공유.", btn:"허브 열기" }
      },
      settings:{ title:"설정", language:{ title:"언어", choose:"언어 선택", apply:"언어 적용", applied:"적용됨" } }
    },

    tr:{
      common:{ back:"⬅ Geri", logout:"Çıkış", connected_as:"Şu kişi olarak giriş yapıldı:" },
      welcome:{
        page_title:"Muhafız — Hoş geldin",
        enter:"İçeri gir",
        greetings:[
          "Hoş geldin yolcu. Muhafız gözetliyor — içeri gir ve dinlen.",
          "Parşömen senin için açılıyor: eşik ötesinde hikâyeler var.",
          "İsmin anahtardır — fısılda ve içeri gir."
        ]
      },
      home:{
        page_title:"Muhafız — Ana Sayfa",
        header:"Muhafız — Ana Sayfa",
        header_connected:"Giriş: ",
        choose:"Bir bölüm seç",
        wizard_title:"Muhafız seni izliyor",
        greetings:[
          "İçeri girmeden önce adını parşömene yaz.",
          "Ateş yanıyor: e-posta ve şifre, sonra yerini al.",
          "Doğru sözleri söyle, kapı açılsın."
        ],
        login:{
          title:"Giriş",
          email:"E-posta",
          password:"Şifre",
          remember:"Bu cihazda hatırla",
          signin:"Giriş yap",
          signup:"Kayıt ol",
          status:{
            fill_both:"E-posta ve şifre girin.",
            signing_in:"Giriş yapılıyor…",
            error_login_prefix:"Giriş hatası: ",
            registering:"Kayıt yapılıyor…",
            error_signup_prefix:"Kayıt hatası: ",
            registered:"Kayıt tamam! E-postanı kontrol edip giriş yap.",
            ok:"Giriş başarılı."
          }
        },
        master:{ title:"🎩 Usta Modu",       desc:"Usta paneli (kampanyalar, araçlar).", btn:"Usta olarak gir" },
        player:{ title:"🧝‍♂️ Oyuncu Modu",    desc:"Bir oturuma bağlan (MVP).",          btn:"Oyuncu olarak gir" },
        settings:{ title:"⚙️ Ayarlar",       desc:"Uygulama tercihleri ve yapılandırma.", btn:"Ayarları aç" },
        hub:{ title:"📣 Topluluk Merkezi",    desc:"Haritalar, canavarlar, görevler ve fikirleri paylaş.", btn:"Merkezi aç" }
      },
      settings:{ title:"Ayarlar", language:{ title:"Dil", choose:"Dilini seç", apply:"Dili uygula", applied:"Uygulandı" } }
    },

    id:{
      common:{ back:"⬅ Kembali", logout:"Keluar", connected_as:"Masuk sebagai:" },
      welcome:{
        page_title:"Sang Penjaga — Selamat Datang",
        enter:"Masuk",
        greetings:[
          "Selamat datang, pengembara. Penjaga berjaga — masuk dan beristirahatlah.",
          "Gulungan terbuka untukmu: kisah-kisah di balik ambang.",
          "Namamu adalah kunci — bisikkan dan masuklah."
        ]
      },
      home:{
        page_title:"Sang Penjaga — Beranda",
        header:"Sang Penjaga — Beranda",
        header_connected:"Masuk: ",
        choose:"Pilih bagian",
        wizard_title:"Sang Penjaga mengawasi Anda",
        greetings:[
          "Sebelum masuk, tuliskan namamu pada gulungan.",
          "Api menyala: email dan sandi, lalu duduklah.",
          "Ucapkan kata yang tepat maka pintu akan terbuka."
        ],
        login:{
          title:"Masuk",
          email:"Email",
          password:"Kata sandi",
          remember:"Ingat saya di perangkat ini",
          signin:"Masuk",
          signup:"Daftar",
          status:{
            fill_both:"Masukkan email dan kata sandi.",
            signing_in:"Sedang masuk…",
            error_login_prefix:"Kesalahan masuk: ",
            registering:"Mendaftar…",
            error_signup_prefix:"Kesalahan pendaftaran: ",
            registered:"Terdaftar! Cek email lalu masuk.",
            ok:"Berhasil masuk."
          }
        },
        master:{ title:"🎩 Mode Master",    desc:"Panel Master (kampanye, alat).",         btn:"Masuk sebagai Master" },
        player:{ title:"🧝‍♂️ Mode Pemain",  desc:"Terhubung ke sesi (MVP).",               btn:"Masuk sebagai Pemain" },
        settings:{ title:"⚙️ Pengaturan",    desc:"Preferensi & konfigurasi aplikasi.",     btn:"Buka Pengaturan" },
        hub:{ title:"📣 Pusat Komunitas",    desc:"Bagikan peta, monster, quest, dan ide.", btn:"Buka Hub" }
      },
      settings:{ title:"Pengaturan", language:{ title:"Bahasa", choose:"Pilih bahasamu", apply:"Terapkan bahasa", applied:"Bahasa diterapkan" } }
    },

    pl:{
      common:{ back:"⬅ Wstecz", logout:"Wyloguj", connected_as:"Zalogowano jako:" },
      welcome:{
        page_title:"Opiekun — Witaj",
        enter:"Wejdź",
        greetings:[
          "Witaj, wędrowcze. Opiekun czuwa — wejdź i odpocznij.",
          "Pergamin rozwija się dla ciebie: opowieści za progiem.",
          "Twoje imię jest kluczem — wypowiedz je i wejdź."
        ]
      },
      home:{
        page_title:"Opiekun — Strona główna",
        header:"Opiekun — Strona główna",
        header_connected:"Zalogowano: ",
        choose:"Wybierz sekcję",
        wizard_title:"Opiekun cię obserwuje",
        greetings:[
          "Zanim wejdziesz, wpisz swoje imię na pergaminie.",
          "Ogień płonie: e-mail i hasło, potem usiądź.",
          "Wypowiedz właściwe słowa, a drzwi się otworzą."
        ],
        login:{
          title:"Zaloguj się",
          email:"E-mail",
          password:"Hasło",
          remember:"Zapamiętaj na tym urządzeniu",
          signin:"Zaloguj",
          signup:"Zarejestruj",
          status:{
            fill_both:"Podaj e-mail i hasło.",
            signing_in:"Logowanie…",
            error_login_prefix:"Błąd logowania: ",
            registering:"Rejestracja…",
            error_signup_prefix:"Błąd rejestracji: ",
            registered:"Zarejestrowano! Sprawdź e-mail i zaloguj się.",
            ok:"Zalogowano."
          }
        },
        master:{ title:"🎩 Tryb Mistrza Gry", desc:"Panel MG (kampanie, narzędzia).", btn:"Wejdź jako Mistrz Gry" },
        player:{ title:"🧝‍♂️ Tryb Gracza",    desc:"Połącz z sesją (MVP).",             btn:"Wejdź jako Gracz" },
        settings:{ title:"⚙️ Ustawienia",     desc:"Preferencje i konfiguracja aplikacji.", btn:"Otwórz Ustawienia" },
        hub:{ title:"📣 Centrum społeczności",desc:"Udostępniaj mapy, potwory, zadania i pomysły.", btn:"Otwórz Hub" }
      },
      settings:{ title:"Ustawienia", language:{ title:"Język", choose:"Wybierz język", apply:"Zastosuj język", applied:"Zastosowano" } }
    },

    nl:{
      common:{ back:"⬅ Terug", logout:"Afmelden", connected_as:"Aangemeld als:" },
      welcome:{
        page_title:"De Bewaker — Welkom",
        enter:"Binnen",
        greetings:[
          "Welkom, reiziger. De Bewaker waakt — kom binnen en rust uit.",
          "De perkamentrol ontvouwt zich voor jou: verhalen voorbij de drempel.",
          "Je naam is de sleutel — spreek hem zacht en treed binnen."
        ]
      },
      home:{
        page_title:"De Bewaker — Start",
        header:"De Bewaker — Start",
        header_connected:"Aangemeld: ",
        choose:"Kies een onderdeel",
        wizard_title:"De Bewaker houdt je in de gaten",
        greetings:[
          "Voor je binnenkomt, zet je naam op het perkament.",
          "Het vuur brandt: e-mail en wachtwoord, neem plaats.",
          "Spreek de juiste woorden en de deur gaat open."
        ],
        login:{
          title:"Aanmelden",
          email:"E-mail",
          password:"Wachtwoord",
          remember:"Onthoud mij op dit apparaat",
          signin:"Aanmelden",
          signup:"Registreren",
          status:{
            fill_both:"Voer e-mail en wachtwoord in.",
            signing_in:"Bezig met aanmelden…",
            error_login_prefix:"Aanmeldfout: ",
            registering:"Registreren…",
            error_signup_prefix:"Registratiefout: ",
            registered:"Geregistreerd! Controleer je e-mail en meld je aan.",
            ok:"Aangemeld."
          }
        },
        master:{ title:"🎩 Spelleider-modus", desc:"Paneel voor de spelleider (campagnes, tools).", btn:"Binnen als Spelleider" },
        player:{ title:"🧝‍♂️ Spelersmodus",   desc:"Verbind met een sessie (MVP).",               btn:"Binnen als Speler" },
        settings:{ title:"⚙️ Instellingen",   desc:"App-voorkeuren en configuratie.",             btn:"Instellingen openen" },
        hub:{ title:"📣 Communityhub",        desc:"Deel kaarten, monsters, quests en ideeën.",   btn:"Hub openen" }
      },
      settings:{ title:"Instellingen", language:{ title:"Taal", choose:"Kies je taal", apply:"Taal toepassen", applied:"Toegepast" } }
    },

    cs:{
      common:{ back:"⬅ Zpět", logout:"Odhlásit se", connected_as:"Přihlášen jako:" },
      welcome:{
        page_title:"Strážce — Vítej",
        enter:"Vstoupit",
        greetings:[
          "Vítej, poutníku. Strážce bdí — vstup a odpočiň si.",
          "Pergamen se ti rozvíjí: příběhy za prahem.",
          "Tvé jméno je klíč — pošeptat a vstup."
        ]
      },
      home:{
        page_title:"Strážce — Domů",
        header:"Strážce — Domů",
        header_connected:"Přihlášen: ",
        choose:"Vyber sekci",
        wizard_title:"Strážce tě pozoruje",
        greetings:[
          "Než vstoupíš, napiš své jméno na pergamen.",
          "Oheň plane: e-mail a heslo, pak se usaď.",
          "Řekni správná slova a dveře se otevřou."
        ],
        login:{
          title:"Přihlášení",
          email:"E-mail",
          password:"Heslo",
          remember:"Pamatovat na tomto zařízení",
          signin:"Přihlásit se",
          signup:"Registrovat se",
          status:{
            fill_both:"Zadej e-mail a heslo.",
            signing_in:"Přihlašuji…",
            error_login_prefix:"Chyba přihlášení: ",
            registering:"Registruji…",
            error_signup_prefix:"Chyba registrace: ",
            registered:"Zaregistrováno! Zkontroluj e-mail a přihlas se.",
            ok:"Přihlášeno."
          }
        },
        master:{ title:"🎩 Režim Pána jeskyně", desc:"Panel PJ (kampaně, nástroje).", btn:"Vstoupit jako PJ" },
        player:{ title:"🧝‍♂️ Režim Hráče",      desc:"Připojit se k sezení (MVP).",  btn:"Vstoupit jako Hráč" },
        settings:{ title:"⚙️ Nastavení",        desc:"Předvolby a konfigurace aplikace.", btn:"Otevřít Nastavení" },
        hub:{ title:"📣 Komunitní centrum",     desc:"Sdílej mapy, nestvůry, questy a nápady.",    btn:"Otevřít Hub" }
      },
      settings:{ title:"Nastavení", language:{ title:"Jazyk", choose:"Vyber svůj jazyk", apply:"Použít jazyk", applied:"Použito" } }
    },

    vi:{
      common:{ back:"⬅ Quay lại", logout:"Đăng xuất", connected_as:"Đăng nhập là:" },
      welcome:{
        page_title:"Người Canh Giữ — Chào mừng",
        enter:"Vào",
        greetings:[
          "Chào mừng, lữ khách. Người Canh Giữ dõi theo — vào nghỉ chân.",
          "Cuộn giấy mở ra cho bạn: chuyện kể sau bậc cửa.",
          "Tên bạn là chìa khóa — khẽ nói và bước vào."
        ]
      },
      home:{
        page_title:"Người Canh Giữ — Trang chủ",
        header:"Người Canh Giữ — Trang chủ",
        header_connected:"Đăng nhập: ",
        choose:"Chọn mục",
        wizard_title:"Người Canh Giữ đang dõi theo bạn",
        greetings:[
          "Trước khi vào, hãy ký tên bạn lên cuộn giấy.",
          "Lò lửa đã đỏ: email và mật khẩu, rồi ngồi xuống.",
          "Nói đúng lời, cánh cửa sẽ mở."
        ],
        login:{
          title:"Đăng nhập",
          email:"Email",
          password:"Mật khẩu",
          remember:"Ghi nhớ trên thiết bị này",
          signin:"Đăng nhập",
          signup:"Đăng ký",
          status:{
            fill_both:"Nhập email và mật khẩu.",
            signing_in:"Đang đăng nhập…",
            error_login_prefix:"Lỗi đăng nhập: ",
            registering:"Đang đăng ký…",
            error_signup_prefix:"Lỗi đăng ký: ",
            registered:"Đã đăng ký! Kiểm tra email rồi đăng nhập.",
            ok:"Đã đăng nhập."
          }
        },
        master:{ title:"🎩 Chế độ Quản trò", desc:"Bảng điều khiển GM (chiến dịch, công cụ).", btn:"Vào với tư cách Quản trò" },
        player:{ title:"🧝‍♂️ Chế độ Người chơi", desc:"Kết nối phiên chơi (MVP).",                 btn:"Vào với tư cách Người chơi" },
        settings:{ title:"⚙️ Cài đặt",       desc:"Tùy chọn và cấu hình ứng dụng.",               btn:"Mở Cài đặt" },
        hub:{ title:"📣 Trung tâm Cộng đồng", desc:"Chia sẻ bản đồ, quái vật, nhiệm vụ và ý tưởng.", btn:"Mở Hub" }
      },
      settings:{ title:"Cài đặt", language:{ title:"Ngôn ngữ", choose:"Chọn ngôn ngữ", apply:"Áp dụng ngôn ngữ", applied:"Đã áp dụng" } }
    }
  };

  // ===== Risoluzione e API =====
  function resolve(lang, key) {
    const parts = key.split('.');
    // 1) lingua piena
    let cur = DICT[lang], tmp = cur;
    for (const p of parts) tmp = tmp?.[p];
    if (tmp !== undefined) return tmp;
    // 2) base (es. pt-BR → pt)
    const base = lang.split('-')[0];
    if (base && base !== lang) {
      cur = DICT[base]; tmp = cur;
      for (const p of parts) tmp = tmp?.[p];
      if (tmp !== undefined) return tmp;
    }
    // 3) fallback neutro EN
    cur = DICT.en; tmp = cur;
    for (const p of parts) tmp = tmp?.[p];
    if (tmp !== undefined) return tmp;
    // 4) chiave grezza
    return key;
  }

  function t(key){ return resolve(currentLang, key); }

  function apply(root=document){
    root.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (typeof val==='string' && val!==key) el.textContent = val;
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (typeof val==='string' && val!==key) el.setAttribute('placeholder', val);
    });
  }
  function pick(key){
    const val = t(key);
    if (Array.isArray(val)) return val[Math.floor(Math.random()*val.length)];
    return val;
  }

  function setHtmlLangAttr(lang){
    const htmlLang = lang.startsWith('zh') ? 'zh' : (lang.split('-')[0]||'en');
    document.documentElement.setAttribute('lang', htmlLang);
  }

  // ===== NEW: Tema pergamena globale (sfondo + cornice) =====
  function computeAssetsBase(){
    // Esempio: file:///C:/.../assets/js/i18n.js -> .../assets
    const src = document.currentScript?.src || '';
    return src.replace(/\/js\/i18n\.js(?:\?.*)?$/, '');
  }
  function installPergamenaTheme(){
    if (document.head.querySelector('[data-custode-theme="pergamena"]')) return; // già installato
    const base = computeAssetsBase();
    const css = `
      :root{
        --cust-legno:#4b3621;
        --cust-pergamena-img:url('${base}/img/sfondo-pergamena-decor.jpg');
        --cust-cornice-img:url('${base}/img/cornice-legno.png');
      }
      /* Applica a tutte le pagine, a meno che il body NON abbia data-no-theme */
      body:not([data-no-theme]){
        background:
          radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,.06), transparent 70%),
          #fff3d4 var(--cust-pergamena-img) no-repeat center center fixed;
        background-size:cover;
      }
      /* Cornice pronta all'uso quando si mette .cornice nel markup */
      .cornice{
        border:40px solid transparent;
        -webkit-border-image:var(--cust-cornice-img) 40 stretch;
        border-image:var(--cust-cornice-img) 40 stretch;
      }
    `;
    const tag = document.createElement('style');
    tag.setAttribute('data-custode-theme','pergamena');
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  // (opzionale) Supabase: sync lingua su user_metadata
  function injectSupabaseSDK() {
    return new Promise(resolve => {
      if (window.supabase) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
  }
  async function getSupabaseClient(){
    if (window.supabaseClient) return window.supabaseClient;
    await injectSupabaseSDK();
    if (!window.supabase) return null;
    const url = window.SUPABASE_URL || localStorage.getItem(LS_SB_URL_KEY);
    const key = window.SUPABASE_ANON_KEY || localStorage.getItem(LS_SB_KEY_KEY);
    if (!url || !key) return null;
    try{ window.supabaseClient = window.supabase.createClient(url, key); return window.supabaseClient; }
    catch{ return null; }
  }
  async function writeLangToUserMeta(client, lang){
    try{ await client.auth.updateUser({ data:{ lang } }); }catch{}
  }

  async function setLang(lang,{skipPersist=false, skipCloud=false}={}){
    if (!lang) return currentLang;
    currentLang = lang;
    setHtmlLangAttr(lang);
    if (!skipPersist){ try{ localStorage.setItem(LS_LANG_KEY, lang); }catch{} }
    if (!skipCloud){
      const c = await getSupabaseClient();
      if (c) await writeLangToUserMeta(c, lang);
    }
    apply(document);
    try{ window.dispatchEvent(new CustomEvent('i18n:change',{detail:{lang}})); }catch{}
    return lang;
  }
  function getLang(){ return currentLang; }

  // ===== Init =====
  async function init(){
    // 0) installa SUBITO il tema globale
    installPergamenaTheme();

    // salva env Supabase (se presenti)
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY){
      try{
        localStorage.setItem(LS_SB_URL_KEY, window.SUPABASE_URL);
        localStorage.setItem(LS_SB_KEY_KEY, window.SUPABASE_ANON_KEY);
      }catch{}
    }

    let lang = null;
    try{ lang = localStorage.getItem(LS_LANG_KEY); }catch{}
    if (!lang){
      const nav = navigator.language || 'en';
      if (nav.startsWith('pt')) lang = 'pt-BR';
      else if (nav.startsWith('zh')) lang = 'zh-Hans';
      else lang = nav;
    }

    await setLang(lang, { skipCloud:true });

    if (document.readyState==='loading') {
      document.addEventListener('DOMContentLoaded', ()=>apply(document));
    } else {
      apply(document);
    }
  }

  window.i18n = { t, apply, pick, setLang, getLang };
  init();
})();
