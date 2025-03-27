// 簡易版のアイコンコンポーネント
const Icon = ({ name, className = "" }) => {
  // SVGアイコンのパスデータ
  const icons = {
    clock: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
        <path strokeWidth="2" d="M12 6v6l4 2"></path>
      </svg>
    ),
    moon: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    ),
    bell: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
    ),
    play: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
        <path strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    pause: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    info: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
        <path strokeWidth="2" d="M12 16v-4M12 8h.01"></path>
      </svg>
    ),
    list: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    ),
    close: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    ),
    trash: (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    )
  };
  
  return icons[name] || null;
};

// メインアプリケーションコンポーネント
const BabySleepApp = () => {
  // 状態変数
  const [cycleStartTime, setCycleStartTime] = React.useState(null);
  const [isTracking, setIsTracking] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(null);
  const [sleepWindows, setSleepWindows] = React.useState([]);
  const [sleepHistory, setSleepHistory] = React.useState([]);
  const [babyAge, setBabyAge] = React.useState(3); // 月齢（デフォルト値）
  const [alertShown, setAlertShown] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('timer'); // タブナビゲーション用
  const [showNotification, setShowNotification] = React.useState(false);
  const [isNotificationSupported, setIsNotificationSupported] = React.useState(false);
  const [isNotificationAllowed, setIsNotificationAllowed] = React.useState(false);

  // 初期化時にローカルストレージからデータを読み込む
  React.useEffect(() => {
    // ローカルストレージからデータを読み込む
    const loadData = () => {
      try {
        // 赤ちゃんの月齢を読み込む
        const savedAge = localStorage.getItem('babyAge');
        if (savedAge) {
          setBabyAge(parseInt(savedAge));
        }
        
        // 睡眠履歴を読み込む
        const savedHistory = localStorage.getItem('sleepHistory');
        if (savedHistory) {
          setSleepHistory(JSON.parse(savedHistory));
        }
      } catch (e) {
        console.log('データの読み込みに失敗しました', e);
      }
    };
    
    // 通知サポートをチェック
    const checkNotificationSupport = () => {
      const isSupported = 'Notification' in window;
      setIsNotificationSupported(isSupported);
      
      if (isSupported) {
        setIsNotificationAllowed(Notification.permission === 'granted');
      }
    };
    
    loadData();
    checkNotificationSupport();
  }, []);

  // 月齢に基づく推奨覚醒時間（分）
  const getRecommendedAwakeTime = (ageMonths) => {
    if (ageMonths < 1) return 45;
    if (ageMonths < 3) return 60;
    if (ageMonths < 6) return 75;
    if (ageMonths < 9) return 90;
    if (ageMonths < 12) return 105;
    if (ageMonths < 18) return 120;
    return 150;
  };

  // 覚醒サイクルをスタートする
  const startCycle = () => {
    const now = new Date();
    setCycleStartTime(now);
    setIsTracking(true);
    setAlertShown(false);
    
    // 次の眠りのタイミングを予測
    const recommendedAwake = getRecommendedAwakeTime(babyAge);
    const nextWindow = new Date(now.getTime() + recommendedAwake * 60000);
    setSleepWindows([{
      start: new Date(nextWindow.getTime() - 10 * 60000), // 推奨時間の10分前
      ideal: nextWindow,
      end: new Date(nextWindow.getTime() + 15 * 60000), // 推奨時間の15分後
    }]);
    
    // ローカルストレージに保存
    try {
      localStorage.setItem('babyAge', babyAge.toString());
    } catch (e) {
      console.log('ローカルストレージへの保存に失敗しました', e);
    }
  };

  // 覚醒サイクルをリセットする
  const resetCycle = () => {
    if (isTracking && cycleStartTime) {
      // 履歴に追加
      const sleepSession = {
        id: Date.now(), // ユニークIDを追加
        date: new Date().toLocaleDateString(),
        start: new Date(cycleStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        end: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        duration: Math.round((new Date() - new Date(cycleStartTime)) / 60000)
      };
      
      const newHistory = [sleepSession, ...sleepHistory.slice(0, 19)]; // 最大20件保存
      setSleepHistory(newHistory);
      
      // ローカルストレージに保存
      try {
        localStorage.setItem('sleepHistory', JSON.stringify(newHistory));
      } catch (e) {
        console.log('履歴の保存に失敗しました', e);
      }
    }
    
    setCycleStartTime(null);
    setIsTracking(false);
    setTimeRemaining(null);
    setSleepWindows([]);
  };

  // タイマーを更新する
  React.useEffect(() => {
    if (!isTracking || !cycleStartTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const elapsedMinutes = Math.floor((now - new Date(cycleStartTime)) / 60000);
      const recommendedAwake = getRecommendedAwakeTime(babyAge);
      
      // 残り時間を計算
      const remainingMinutes = recommendedAwake - elapsedMinutes;
      setTimeRemaining(remainingMinutes);
      
      // 眠りのタイミングのアラート
      if (remainingMinutes <= 10 && remainingMinutes >= 0 && !alertShown) {
        // ブラウザの通知APIが利用可能かつ許可されていれば通知を表示
        if (isNotificationSupported && isNotificationAllowed) {
          new Notification("寝かしつけタイミングです", {
            body: "もうすぐ理想的な寝かしつけタイミングです",
          });
        } else {
          // 画面内通知を表示
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
        
        setAlertShown(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTracking, cycleStartTime, babyAge, alertShown, isNotificationSupported, isNotificationAllowed]);

  // 眠りのタイミング表示用
  const getSleepWindowStatus = () => {
    if (!isTracking || sleepWindows.length === 0) return null;
    
    const now = new Date();
    const window = sleepWindows[0];
    
    if (now < window.start) {
      return "まだ早いです";
    } else if (now >= window.start && now < window.ideal) {
      return "もうすぐ理想的なタイミングです";
    } else if (now >= window.ideal && now < window.end) {
      return "今が寝かしつけの理想的なタイミングです！";
    } else {
      return "眠りのサインを見逃さないように注意してください";
    }
  };
  
  // 残り時間の色を決定
  const getTimeColor = () => {
    if (!timeRemaining || !isTracking) return "text-gray-400";
    if (timeRemaining <= 0) return "text-red-500";
    if (timeRemaining <= 10) return "text-yellow-500";
    return "text-blue-500";
  };

  // 通知許可リクエスト
  const requestNotificationPermission = async () => {
    if (!isNotificationSupported) return;
    
    try {
      const permission = await Notification.requestPermission();
      setIsNotificationAllowed(permission === 'granted');
    } catch (error) {
      console.error('通知の許可に失敗しました:', error);
    }
  };

  // 履歴をクリア
  const clearHistory = () => {
    setSleepHistory([]);
    try {
      localStorage.removeItem('sleepHistory');
    } catch (e) {
      console.log('履歴のクリアに失敗しました', e);
    }
  };

  // 履歴から項目を削除
  const deleteHistoryItem = (id) => {
    const updatedHistory = sleepHistory.filter(item => item.id !== id);
    setSleepHistory(updatedHistory);
    
    try {
      localStorage.setItem('sleepHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.log('履歴の更新に失敗しました', e);
    }
  };

  // タイマータブの内容
  const TimerTab = () => (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">ベビースリープ</h1>
      
      {/* メインタイマー */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 card">
        {isTracking ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="text-5xl font-light mb-2 text-center">
                <span className={`${getTimeColor()} ${timeRemaining <= 10 ? 'pulse-animation' : ''}`}>
                  {timeRemaining > 0 ? timeRemaining : 0}
                </span>
                <span className="text-gray-400 text-lg ml-1">分</span>
              </div>
              <div className="text-sm text-gray-500">
                覚醒から <span className="font-medium">{Math.floor((new Date() - new Date(cycleStartTime)) / 60000)}</span> 分経過
              </div>
            </div>
            
            {/* 寝かしつけウィンドウステータス */}
            <div className={`mb-6 p-3 rounded-lg ${timeRemaining <= 10 ? "bg-yellow-50" : "bg-blue-50"}`}>
              <div className="flex items-center justify-center">
                <Icon name="bell" className={`${timeRemaining <= 10 ? "text-yellow-500 bell-animation" : "text-blue-500"} mr-2`} />
                <span className="text-sm font-medium">{getSleepWindowStatus()}</span>
              </div>
            </div>
            
            {/* 停止ボタン */}
            <button
              onClick={resetCycle}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors ripple"
            >
              <Icon name="pause" className="mr-2" />
              <span>寝かしつけ完了</span>
            </button>
          </>
        ) : (
          <div>
            <div className="text-center mb-6">
              <span className="text-5xl">👶</span>
              <p className="mt-2 text-gray-600">赤ちゃんが起きたらタイマーをスタート</p>
            </div>
            <button
              onClick={startCycle}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors ripple"
            >
              <Icon name="play" className="mr-2" />
              <span>起床時間を記録</span>
            </button>
          </div>
        )}
      </div>
      
      {/* 今日の状況 */}
      {sleepHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-4 card">
          <h2 className="text-lg font-semibold mb-2">今日の状況</h2>
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">覚醒回数</span>
              <p className="font-medium">{sleepHistory.filter(s => s.date === new Date().toLocaleDateString()).length}回</p>
            </div>
            <div>
              <span className="text-gray-500">平均覚醒時間</span>
              <p className="font-medium">
                {Math.round(
                  sleepHistory
                    .filter(s => s.date === new Date().toLocaleDateString())
                    .reduce((acc, s) => acc + s.duration, 0) / 
                    Math.max(1, sleepHistory.filter(s => s.date === new Date().toLocaleDateString()).length)
                )}分
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 月齢設定 */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 card">
        <h2 className="text-lg font-semibold mb-2">赤ちゃんの月齢</h2>
        <div className="mb-1">
          <label className="block text-sm font-medium mb-2">{babyAge}ヶ月</label>
          <input 
            type="range" 
            min="0" 
            max="24" 
            value={babyAge} 
            onChange={(e) => setBabyAge(parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0ヶ月</span>
            <span>12ヶ月</span>
            <span>24ヶ月</span>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            推奨覚醒時間: <span className="font-medium">{getRecommendedAwakeTime(babyAge)}分</span>
          </div>
        </div>
      </div>
      
      {/* プッシュ通知ボタン */}
      {isNotificationSupported && !isNotificationAllowed && (
        <div className="bg-white rounded-lg shadow p-4 mb-4 card">
          <h2 className="text-lg font-semibold mb-2">通知設定</h2>
          <button
            onClick={requestNotificationPermission}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ripple"
          >
            <Icon name="bell" className="mr-2" />
            <span>通知を許可する</span>
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            寝かしつけタイミングの通知を受け取るには許可が必要です
          </p>
        </div>
      )}
    </div>
  );

  // 情報タブの内容
  const InfoTab = () => (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">睡眠と覚醒の情報</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4 card">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Icon name="clock" className="text-purple-500 mr-2" />
          ポリー・ムーアの90分周期理論
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          赤ちゃんは約90分の覚醒サイクルを持っています。サイクルの終わりに「眠りのウィンドウ」があり、
          この時間に寝かしつけを始めると、スムーズに入眠できます。
        </p>
        <h3 className="font-medium text-gray-800 mb-1">眠りのサイン:</h3>
        <ul className="text-sm text-gray-700 pl-5 list-disc">
          <li>あくびをする</li>
          <li>目をこする</li>
          <li>視線をそらす</li>
          <li>ぐずり始める</li>
          <li>動きが少なくなる</li>
          <li>耳を触る</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4 card">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Icon name="clock" className="text-blue-500 mr-2" />
          月齢別の推奨覚醒時間
        </h2>
        <div className="text-sm">
          <div className="flex justify-between py-1 border-b">
            <span>0-1ヶ月</span>
            <span className="font-medium">45分</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>1-3ヶ月</span>
            <span className="font-medium">60分</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>3-6ヶ月</span>
            <span className="font-medium">75分</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>6-9ヶ月</span>
            <span className="font-medium">90分</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>9-12ヶ月</span>
            <span className="font-medium">105分</span>
          </div>
          <div className="flex justify-between py-1">
            <span>12-18ヶ月</span>
            <span className="font-medium">120分</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4 card">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Icon name="moon" className="text-indigo-500 mr-2" />
          健やかな睡眠のためのヒント
        </h2>
        <ul className="text-sm text-gray-700 pl-5 list-disc">
          <li>一貫した寝かしつけルーティンを作る</li>
          <li>寝室は暗く、静かに保つ</li>
          <li>白色ノイズを活用する</li>
          <li>適切な室温を保つ (18-21℃)</li>
          <li>眠りのサインを見逃さない</li>
        </ul>
      </div>
    </div>
  );

  // 履歴タブの内容
  const HistoryTab = () => (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">睡眠履歴</h1>
      
      {sleepHistory.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-4 mb-4 card">
          <div className="text-sm">
            <div className="flex justify-between py-2 border-b font-medium text-gray-500">
              <span>日付</span>
              <span>時間</span>
              <span>覚醒時間</span>
              <span></span>
            </div>
            {sleepHistory.map((session) => (
              <div key={session.id} className="flex justify-between py-2 border-b last:border-0 items-center">
                <span>{session.date}</span>
                <span>{session.start}</span>
                <span>{session.duration}分</span>
                <button 
                  onClick={() => deleteHistoryItem(session.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  aria-label="削除"
                >
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={clearHistory}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ripple"
          >
            <span>履歴をクリア</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-lg shadow p-4 card">
          <Icon name="list" className="w-12 h-12 mb-2 text-gray-300" />
          <p>睡眠記録はまだありません</p>
        </div>
      )}
    </div>
  );

  // 画面内通知
  const Notification = () => {
    if (!showNotification) return null;
    
    return (
      <div className="fixed top-4 left-0 right-0 mx-auto max-w-sm bg-yellow-100 border border-yellow-200 p-3 rounded-lg flex items-center shadow-lg z-50 animate-fade-in">
        <Icon name="bell" className="text-yellow-500 mr-2" />
        <div className="flex-1">
          <p className="font-medium">寝かしつけタイミング</p>
          <p className="text-sm">もうすぐ理想的な寝かしつけタイミングです</p>
        </div>
        <button 
          onClick={() => setShowNotification(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Icon name="close" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Notification />
      
      {/* タブコンテンツ */}
      {activeTab === 'timer' && <TimerTab />}
      {activeTab === 'info' && <InfoTab />}
      {activeTab === 'history' && <HistoryTab />}
      
      {/* タブナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-white flex justify-around items-center shadow border-t md:border-b md:border-t-0 border-gray-200 h-16 z-10 safe-area-bottom">
        <button 
          onClick={() => setActiveTab('timer')}
          className={`flex flex-col md:flex-row items-center justify-center w-1/3 h-full ${activeTab === 'timer' ? 'text-blue-500 active-tab' : 'text-gray-500'} ripple`}
        >
          <Icon name="clock" className="mb-1 md:mb-0 md:mr-2" />
          <span className="text-xs md:text-sm">タイマー</span>
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex flex-col md:flex-row items-center justify-center w-1/3 h-full ${activeTab === 'info' ? 'text-blue-500 active-tab' : 'text-gray-500'} ripple`}
        >
          <Icon name="info" className="mb-1 md:mb-0 md:mr-2" />
          <span className="text-xs md:text-sm">情報</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col md:flex-row items-center justify-center w-1/3 h-full ${activeTab === 'history' ? 'text-blue-500 active-tab' : 'text-gray-500'} ripple`}
        >
          <Icon name="list" className="mb-1 md:mb-0 md:mr-2" />
          <span className="text-xs md:text-sm">履歴</span>
        </button>
      </div>
    </div>
  );
};

// Reactルートコンポーネントをレンダリングする
ReactDOM.render(<BabySleepApp />, document.getElementById('root'));