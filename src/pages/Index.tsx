import { useState } from "react";
import Icon from "@/components/ui/icon";

const CHALLENGES = [
  {
    id: 1,
    title: "Привет, мир!",
    difficulty: "Лёгкий",
    color: "#00FF94",
    description: "Собери программу, которая выводит текст на экран",
    blocks: ["Начало", "Вывод: «Привет, мир!»", "Конец"],
    xp: 50,
  },
  {
    id: 2,
    title: "Светофор",
    difficulty: "Средний",
    color: "#FFD600",
    description: "Создай логику переключения сигналов светофора",
    blocks: ["Начало", "Если красный", "Ждать 30 сек", "Включить зелёный", "Конец"],
    xp: 120,
  },
  {
    id: 3,
    title: "Калькулятор",
    difficulty: "Сложный",
    color: "#FF5C8A",
    description: "Построй блок-схему простого калькулятора с 4 действиями",
    blocks: ["Начало", "Ввод чисел", "Выбор действия", "Вычислить", "Вывод результата", "Конец"],
    xp: 250,
  },
];

const EXAMPLES = [
  { title: "Угадай число", emoji: "🎯", blocks: 8, category: "Игры", color: "#7C4DFF" },
  { title: "Сортировка списка", emoji: "📋", blocks: 12, category: "Алгоритмы", color: "#00BCD4" },
  { title: "Погодный бот", emoji: "🌤️", blocks: 15, category: "Автоматизация", color: "#FF9800" },
  { title: "Шифр Цезаря", emoji: "🔐", blocks: 10, category: "Безопасность", color: "#E91E63" },
  { title: "Таймер обратного отсчёта", emoji: "⏱️", blocks: 7, category: "Утилиты", color: "#4CAF50" },
  { title: "Квиз-викторина", emoji: "🧠", blocks: 20, category: "Игры", color: "#FF5722" },
];

type Section = "home" | "examples" | "about";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  const totalXP = completedChallenges.reduce((sum, id) => {
    const ch = CHALLENGES.find((c) => c.id === id);
    return sum + (ch?.xp || 0);
  }, 0);

  const handleComplete = (id: number) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges((prev) => [...prev, id]);
    }
    setActiveChallenge(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-golos overflow-x-hidden">
      {/* Фоновые блобы */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#7C4DFF] opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#00FF94] opacity-[0.07] blur-[100px]" />
        <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] rounded-full bg-[#FF5C8A] opacity-[0.06] blur-[80px]" />
      </div>

      {/* Навигация */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection("home")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C4DFF] to-[#00FF94] flex items-center justify-center text-lg">
            🧩
          </div>
          <span className="font-bold text-xl tracking-tight">
            Блок<span className="text-[#00FF94]">Код</span>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1 border border-white/10">
          {(["home", "examples", "about"] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeSection === s
                  ? "bg-gradient-to-r from-[#7C4DFF] to-[#5B34D4] text-white shadow-lg shadow-[#7C4DFF]/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {s === "home" ? "Главная" : s === "examples" ? "Примеры" : "О проекте"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
          <span className="text-[#FFD600] text-sm font-bold">⚡ {totalXP} XP</span>
        </div>
      </nav>

      {/* ===== ГЛАВНАЯ ===== */}
      {activeSection === "home" && (
        <main className="relative z-10">
          {/* Hero */}
          <section className="px-6 md:px-12 pt-20 pb-16 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#7C4DFF]/20 border border-[#7C4DFF]/40 rounded-full px-4 py-2 text-sm text-[#B39DFF] mb-8">
              <span className="w-2 h-2 bg-[#00FF94] rounded-full animate-pulse inline-block" />
              Программирование без синтаксиса
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
              Учись кодить{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#7C4DFF] via-[#FF5C8A] to-[#00FF94] bg-clip-text text-transparent">
                  блоками
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#7C4DFF] via-[#FF5C8A] to-[#00FF94] rounded-full opacity-60" />
              </span>
            </h1>

            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Визуальное программирование для тех, кто только начинает. Собирай алгоритмы как конструктор — без страха ошибиться.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById("challenges")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-gradient-to-r from-[#7C4DFF] to-[#5B34D4] rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-xl shadow-[#7C4DFF]/40 text-white"
              >
                Начать бесплатно →
              </button>
              <button
                onClick={() => setActiveSection("examples")}
                className="px-8 py-4 bg-white/5 border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-200 text-white"
              >
                Смотреть примеры
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { val: "12+", label: "Уроков" },
                { val: "3", label: "Уровня" },
                { val: "∞", label: "Практики" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black text-[#00FF94]">{s.val}</div>
                  <div className="text-sm text-white/50 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Блок-схема */}
          <section className="px-6 md:px-12 py-12 max-w-5xl mx-auto">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#FF5C8A]" />
                <div className="w-3 h-3 rounded-full bg-[#FFD600]" />
                <div className="w-3 h-3 rounded-full bg-[#00FF94]" />
                <span className="text-white/40 text-sm ml-2 font-mono">пример.блок</span>
              </div>

              <div className="flex flex-col items-center">
                {[
                  { label: "▶ Начало", color: "#00FF94" },
                  { label: "↓ Ввод числа", color: "#7C4DFF" },
                  { label: "◆ Число > 0?", color: "#FFD600" },
                  { label: "□ Вывод «Положительное»", color: "#00BCD4" },
                  { label: "■ Конец", color: "#FF5C8A" },
                ].map((block, i, arr) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="px-6 py-3 rounded-xl border-2 font-mono text-sm font-semibold min-w-[240px] text-center transition-all hover:scale-105 cursor-pointer"
                      style={{
                        borderColor: block.color,
                        backgroundColor: block.color + "18",
                        color: block.color,
                        boxShadow: `0 0 20px ${block.color}25`,
                      }}
                    >
                      {block.label}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-0.5 h-6 bg-white/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Челленджи */}
          <section id="challenges" className="px-6 md:px-12 py-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🏆</span>
              <div>
                <h2 className="text-3xl font-black">Практические задачи</h2>
                <p className="text-white/50">Реши челлендж — получи XP</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {CHALLENGES.map((ch) => {
                const done = completedChallenges.includes(ch.id);
                return (
                  <div
                    key={ch.id}
                    className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-white/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
                    onClick={() => setActiveChallenge(ch.id)}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: ch.color }} />
                    {done && (
                      <div className="absolute top-4 right-4 bg-[#00FF94]/20 border border-[#00FF94]/40 rounded-full px-2 py-0.5 text-[#00FF94] text-xs font-bold">
                        ✓ Решено
                      </div>
                    )}
                    <div className="mb-4">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full border"
                        style={{ color: ch.color, borderColor: ch.color + "60", background: ch.color + "15" }}
                      >
                        {ch.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{ch.title}</h3>
                    <p className="text-white/50 text-sm mb-4 leading-relaxed">{ch.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FFD600] text-sm font-bold">⚡ +{ch.xp} XP</span>
                      <span className="text-white/30 text-sm">{ch.blocks.length} блоков</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Модалка */}
          {activeChallenge !== null && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setActiveChallenge(null)}
            >
              <div
                className="bg-[#12121A] border border-white/15 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const ch = CHALLENGES.find((c) => c.id === activeChallenge)!;
                  const done = completedChallenges.includes(ch.id);
                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black">{ch.title}</h3>
                        <button onClick={() => setActiveChallenge(null)} className="text-white/40 hover:text-white text-3xl leading-none w-8 h-8 flex items-center justify-center">
                          ×
                        </button>
                      </div>
                      <p className="text-white/60 mb-6">{ch.description}</p>
                      <div className="bg-black/40 rounded-2xl p-5 mb-6">
                        <div className="text-white/40 text-xs mb-3 font-mono tracking-widest">БЛОКИ ДЛЯ СБОРКИ</div>
                        <div className="flex flex-col gap-2">
                          {ch.blocks.map((b, i) => (
                            <div
                              key={i}
                              className="px-4 py-2.5 rounded-xl border font-mono text-sm"
                              style={{ borderColor: ch.color + "60", background: ch.color + "12", color: ch.color }}
                            >
                              {i + 1}. {b}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleComplete(ch.id)}
                        className="w-full py-3.5 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] text-black"
                        style={{ background: ch.color }}
                      >
                        {done ? "Уже решено ✓" : `Выполнить задачу (+${ch.xp} XP)`}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ===== ПРИМЕРЫ ===== */}
      {activeSection === "examples" && (
        <main className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-black mb-4">
              Готовые{" "}
              <span className="bg-gradient-to-r from-[#00FF94] to-[#00BCD4] bg-clip-text text-transparent">
                примеры
              </span>
            </h2>
            <p className="text-white/50 text-lg">Изучай алгоритмы на реальных задачах</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {EXAMPLES.map((ex, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-white/25 hover:scale-[1.03] transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at top left, ${ex.color}20, transparent 60%)` }}
                />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{ex.emoji}</div>
                  <div
                    className="text-xs font-bold px-2.5 py-1 rounded-full border inline-block mb-3"
                    style={{ color: ex.color, borderColor: ex.color + "50", background: ex.color + "15" }}
                  >
                    {ex.category}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{ex.title}</h3>
                  <div className="flex items-center gap-1.5 text-white/40 text-sm">
                    <Icon name="Layers" size={14} />
                    <span>{ex.blocks} блоков</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-[#7C4DFF]/20 to-[#00FF94]/10 border border-[#7C4DFF]/30 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Хочешь попрактиковаться?</h3>
            <p className="text-white/50 mb-6">Реши наши челленджи и прокачай навыки программирования</p>
            <button
              onClick={() => setActiveSection("home")}
              className="px-8 py-3.5 bg-gradient-to-r from-[#7C4DFF] to-[#5B34D4] rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#7C4DFF]/40 text-white"
            >
              Перейти к задачам →
            </button>
          </div>
        </main>
      )}

      {/* ===== О ПРОЕКТЕ ===== */}
      {activeSection === "about" && (
        <main className="relative z-10 px-6 md:px-12 py-16 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">🧩</div>
            <h2 className="text-5xl font-black mb-5">
              О{" "}
              <span className="bg-gradient-to-r from-[#7C4DFF] to-[#FF5C8A] bg-clip-text text-transparent">
                проекте
              </span>
            </h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
              БлокКод — образовательная платформа, которая учит программированию через визуальные блок-схемы. Никаких сложных синтаксисов — только логика и творчество.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: "Zap", color: "#FFD600", title: "Быстрый старт", desc: "Начни программировать уже через 5 минут. Никакой установки и настройки." },
              { icon: "Shield", color: "#00FF94", title: "Безопасная среда", desc: "Ошибайся без страха. Каждый блок можно переставить, изменить или удалить в любой момент." },
              { icon: "TrendingUp", color: "#7C4DFF", title: "Прогрессивное обучение", desc: "От простого к сложному. Система XP мотивирует двигаться вперёд." },
              { icon: "Users", color: "#FF5C8A", title: "Для всех возрастов", desc: "Подходит для детей от 8 лет и взрослых, которые хотят освоить основы алгоритмики." },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-white/20 transition-all duration-300 hover:scale-[1.01]"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: f.color + "20", border: `1.5px solid ${f.color}40` }}
                >
                  <Icon name={f.icon} size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#7C4DFF]/20 via-[#FF5C8A]/10 to-[#00FF94]/10 border border-white/10 rounded-3xl p-10 text-center">
            <h3 className="text-3xl font-black mb-4">Миссия проекта</h3>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Мы верим, что программирование — это суперсила 21 века. И каждый заслуживает шанса её освоить, независимо от возраста и опыта.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveSection("home")}
                className="px-8 py-3.5 bg-gradient-to-r from-[#7C4DFF] to-[#5B34D4] rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#7C4DFF]/40 text-white"
              >
                Начать обучение →
              </button>
              <button
                onClick={() => setActiveSection("examples")}
                className="px-8 py-3.5 bg-white/5 border border-white/20 rounded-2xl font-bold hover:bg-white/10 hover:scale-105 transition-all text-white"
              >
                Смотреть примеры
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Футер */}
      <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧩</span>
            <span className="font-bold">Блок<span className="text-[#00FF94]">Код</span></span>
          </div>
          <p className="text-white/30 text-sm">Учись программировать блоками — без страха и без синтаксиса</p>
          <div className="text-[#FFD600] text-sm font-bold">⚡ {totalXP} XP набрано</div>
        </div>
      </footer>
    </div>
  );
}