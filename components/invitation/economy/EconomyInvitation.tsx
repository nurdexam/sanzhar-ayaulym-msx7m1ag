"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  MusicNotes,
  Pause,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { InvitationData } from "@/types/invitation";

interface StandardInvitationProps {
  data: InvitationData;
}

export default function StandardInvitation({
  data,
}: StandardInvitationProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /*
  |--------------------------------------------------------------------------
  | COUNTDOWN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const target = new Date(data.dateTime);

    const updateTimer = () => {
      const difference = target.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setTimeLeft({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [data.dateTime]);

  /*
  |--------------------------------------------------------------------------
  | MUSIC
  |--------------------------------------------------------------------------
  */

  const toggleMusic = () => {
    const audio = document.getElementById(
      "standard-music"
    ) as HTMLAudioElement | null;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        console.log("Музыканы ойнату мүмкін болмады.");
      });
  };

  /*
  |--------------------------------------------------------------------------
  | RSVP
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Аты-жөніңізді енгізіңіз");
      return;
    }

    if (attending === null) {
      setMessage("Жауабыңызды таңдаңыз");
      return;
    }

    if (!data.clientEmail) {
      setMessage("Email табылмады");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEmail: data.clientEmail,
          name: name.trim(),
          guests,
          attending,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Қате орын алды"
        );
      }

      setMessage(
        "Рақмет! Жауабыңыз қабылданды ❤️"
      );

      setName("");
      setGuests(1);
      setAttending(null);
    } catch (error) {
      console.error("RSVP error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Жауапты жіберу мүмкін болмады"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7e8eb] text-[#62524d]">

      {/* =====================================================
          MUSIC
      ===================================================== */}

      <audio
        id="standard-music"
        loop
        preload="metadata"
      >
        <source
          src="/music/toy.mp3"
          type="audio/mpeg"
        />
      </audio>

      <button
        type="button"
        onClick={toggleMusic}
        aria-label="Музыканы қосу"
        className="
          fixed
          right-4
          top-4
          z-[100]
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-[#9b7e82]/30
          bg-[#fffafa]/80
          text-[#795f63]
          shadow-sm
          backdrop-blur-md
          transition
          hover:scale-105
        "
      >
        {isPlaying ? (
          <Pause size={16} />
        ) : (
          <MusicNotes size={16} />
        )}
      </button>

      {/* =====================================================
          INVITATION
      ===================================================== */}

      <div className="
        relative
        mx-auto
        min-h-screen
        max-w-[520px]
        overflow-hidden
        bg-[#fffdfa]
        shadow-2xl
      ">

        <WatercolorTop />

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative min-h-[760px] px-8 pt-20">

          <div className="relative z-10 text-center">

            <motion.p
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="
                font-serif
                text-[11px]
                uppercase
                tracking-[0.22em]
                text-[#75645f]
              "
            >
              Тойға шақыру
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.25,
                duration: 1.2,
              }}
              className="mt-8"
            >

              <p className="
                font-wedding
                text-[56px]
                leading-[0.8]
                text-[#866e65]
              ">
                {data.groom}
              </p>

              <p className="
                mt-2
                font-wedding
                text-[42px]
                leading-none
                text-[#a28a80]
              ">
                &
              </p>

              <p className="
                mt-1
                font-wedding
                text-[56px]
                leading-[0.8]
                text-[#866e65]
              ">
                {data.bride}
              </p>

            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 1,
              }}
              className="mt-8"
            >
              <p className="
                font-serif
                text-[12px]
                tracking-[0.12em]
                text-[#85736e]
              ">
                {data.date}
              </p>
            </motion.div>

          </div>

          <FloralDivider />

          <div className="
            absolute
            bottom-0
            left-[-10%]
            h-[330px]
            w-[120%]
            rounded-[50%_50%_0_0]
            bg-[#fffdfa]
          " />

          <div className="
            absolute
            bottom-[205px]
            left-0
            right-0
            z-10
          ">
            <BottomFlowers />
          </div>

        </section>

        {/* ===================================================
            INVITATION TEXT
        =================================================== */}

        <section className="
          relative
          bg-[#fffdfa]
          px-10
          pb-20
          pt-4
        ">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-center"
          >

            <p className="
              font-serif
              text-[12px]
              uppercase
              tracking-[0.15em]
              text-[#786b66]
            ">
              ҚҰРМЕТТІ ҚОНАҚТАР!
            </p>

            <p className="
              mt-7
              font-serif
              text-[12px]
              uppercase
              leading-[2.1]
              tracking-[0.04em]
              text-[#756762]
            ">
              СІЗДЕРДІ
            </p>

            <p className="
              mt-1
              font-wedding
              text-[34px]
              text-[#8b7169]
            ">
              {data.groom} мен {data.bride}
            </p>

            <p className="
              mt-2
              font-serif
              text-[12px]
              uppercase
              leading-[2.2]
              tracking-[0.04em]
              text-[#756762]
            ">
              ҮЙЛЕНУ ТОЙЫНА
              <br />
              ҚУАНА ШАҚЫРАМЫЗ.
              <br />
              БІЗДІҢ БАҚЫТЫМЫЗҒА
              <br />
              КУӘ БОЛЫП,
              <br />
              ОСЫ ҰМЫТЫЛМАС
              <br />
              СӘТТЕРДІ БІЗБЕН
              <br />
              БІРГЕ БӨЛІСУГЕ
              <br />
              КЕЛІҢІЗДЕР!
            </p>

            <div className="mt-8 flex justify-center">
              <BranchDivider />
            </div>

          </motion.div>

        </section>

        {/* ===================================================
            WEDDING CALENDAR
        =================================================== */}

        <section className="
          relative
          overflow-hidden
          bg-[#fffdfa]
          px-8
          pb-24
          pt-10
        ">

          <div className="
            absolute
            left-[-70px]
            top-20
            h-40
            w-40
            rounded-full
            bg-[#f7c7d0]/30
            blur-2xl
          " />

          <div className="
            absolute
            right-[-70px]
            top-28
            h-40
            w-40
            rounded-full
            bg-[#d8e5ef]/30
            blur-2xl
          " />

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="relative z-10 text-center"
          >

            <p className="
              font-serif
              text-[12px]
              uppercase
              tracking-[0.2em]
              text-[#796b66]
            ">
              ТОЙ САЛТАНАТЫ
            </p>

            <WeddingCalendar date={data.date} />

          </motion.div>

          <div className="
            absolute
            bottom-[-60px]
            left-[-50px]
          ">
            <PinkWatercolor />
          </div>

        </section>

        {/* ===================================================
            VENUE
        =================================================== */}

        <section className="
          relative
          overflow-hidden
          bg-[#fffdfa]
          px-8
          pb-24
          pt-14
        ">

          <div className="
            pointer-events-none
            absolute
            -right-24
            top-10
            h-44
            w-44
            rounded-full
            bg-[#b9c8dc]/20
            blur-3xl
          " />

          <div className="
            pointer-events-none
            absolute
            -left-24
            bottom-0
            h-44
            w-44
            rounded-full
            bg-[#efb7c2]/20
            blur-3xl
          " />

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              relative
              z-10
              text-center
            "
          >

            <p className="
              font-serif
              text-[11px]
              uppercase
              tracking-[0.25em]
              text-[#8b7771]
            ">
              МЕКЕНЖАЙЫ
            </p>

            <div className="
              mx-auto
              mt-5
              flex
              items-center
              justify-center
              gap-3
            ">
              <span className="h-px w-10 bg-[#d9c3c0]" />
              <span className="text-[#b9918b]">✦</span>
              <span className="h-px w-10 bg-[#d9c3c0]" />
            </div>

            <h2 className="
              mt-7
              font-wedding
              text-[34px]
              leading-tight
              text-[#806861]
            ">
              {data.venue}
            </h2>

            <p className="
              mx-auto
              mt-4
              max-w-[280px]
              font-serif
              text-[12px]
              leading-[1.9]
              text-[#8b7974]
            ">
              {data.address}
            </p>

            <div className="mt-7 flex justify-center">

              <div className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                border-[#d9bfc0]
                bg-[#fff8f7]
                text-[#967775]
              ">
                <MapPin
                  size={21}
                  weight="light"
                />
              </div>

            </div>

            <a
              href={`https://2gis.kz/search/${encodeURIComponent(
                `${data.venue}, ${data.address}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mx-auto
                mt-5
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#806861]
                bg-transparent
                px-8
                py-3
                font-serif
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-[#806861]
                transition-all
                duration-300
                hover:bg-[#806861]
                hover:text-white
              "
            >
              <MapPin size={14} />

              КАРТАДАН КӨРУ
            </a>

          </motion.div>

        </section>

        {/* ===================================================
            DRESS CODE
        =================================================== */}

        <section className="
          relative
          overflow-hidden
          bg-[#f4dce1]
          px-8
          pb-24
          pt-16
        ">

          <DressCodeFlowers />

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              relative
              z-10
              text-center
            "
          >

            <p className="
              font-wedding
              text-[31px]
              text-[#765f5e]
            ">
              Дресс-код
            </p>

            <p className="
              mt-3
              font-serif
              text-[10px]
              uppercase
              tracking-[0.12em]
              text-[#8d7773]
            ">
              Сіздерден осы түстерді таңдауды сұраймыз
            </p>

            <div className="
              mt-8
              flex
              justify-center
              gap-3
            ">
              <DressColor color="#9d8fd6" />
              <DressColor color="#8094c8" />
              <DressColor color="#e9aebb" />
              <DressColor color="#c9b08b" />
              <DressColor color="#e5ddd2" />
            </div>

          </motion.div>

        </section>

        {/* ===================================================
            COUNTDOWN
        =================================================== */}

        <section className="
          relative
          overflow-hidden
          bg-[#f4dce1]
          px-8
          pb-20
          pt-8
        ">

          <div className="
            absolute
            left-[-60px]
            top-20
          ">
            <SmallFlower />
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              relative
              z-10
              text-center
            "
          >

            <p className="
              font-serif
              text-[12px]
              uppercase
              tracking-[0.1em]
              text-[#75625f]
            ">
              ТОЙ САЛТАНАТЫНА ДЕЙІН
            </p>

            <div className="
              mx-auto
              mt-7
              grid
              max-w-[320px]
              grid-cols-4
              gap-3
            ">

              <CountdownNumber
                value={timeLeft.days}
                label="КҮН"
              />

              <CountdownNumber
                value={timeLeft.hours}
                label="САҒАТ"
              />

              <CountdownNumber
                value={timeLeft.minutes}
                label="МИН"
              />

              <CountdownNumber
                value={timeLeft.seconds}
                label="СЕК"
              />

            </div>

          </motion.div>

        </section>

        {/* ===================================================
            TOY IGERI
        =================================================== */}

        <section className="
          relative
          overflow-hidden
          bg-[#f4dce1]
          px-8
          pb-20
          pt-5
        ">

          <div className="
            absolute
            bottom-0
            left-[-30px]
          ">
            <SoftFlower />
          </div>

          <div className="
            relative
            z-10
            text-center
          ">

            <p className="
              font-serif
              text-[12px]
              uppercase
              tracking-[0.1em]
              text-[#75625f]
            ">
              ТОЙ ИЕЛЕРІ
            </p>

            <p className="
              mt-4
              font-wedding
              text-[35px]
              text-[#80655f]
            ">
              {data.groom} & {data.bride}
            </p>

            <p className="
              mt-8
              font-serif
              text-[12px]
              uppercase
              leading-[2]
              text-[#75625f]
            ">
              ТОЙҒА
              <br />
              ҚАТЫСАТЫНДЫҒЫҢЫЗДЫ
              <br />
              АЛДЫН АЛА
              <br />
              РАСТАУЫҢЫЗДЫ
              <br />
              СҰРАЙМЫЗ!
            </p>

          </div>

        </section>

        {/* ===================================================
            RSVP
        =================================================== */}

        <section className="
          relative
          bg-[#f4dce1]
          px-8
          pb-28
          pt-5
        ">

          <div className="
            mx-auto
            max-w-[340px]
          ">

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Аты-жөніңіз"
                className="
                  w-full
                  rounded-full
                  border
                  border-[#8c7675]
                  bg-transparent
                  px-5
                  py-3
                  text-center
                  font-serif
                  text-[11px]
                  text-[#665654]
                  outline-none
                  placeholder:text-[#9b8582]
                "
              />

              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) =>
                  setGuests(
                    Math.max(
                      1,
                      Number(e.target.value)
                    )
                  )
                }
                placeholder="Қонақтар саны"
                className="
                  w-full
                  rounded-full
                  border
                  border-[#8c7675]
                  bg-transparent
                  px-5
                  py-3
                  text-center
                  font-serif
                  text-[11px]
                  text-[#665654]
                  outline-none
                  placeholder:text-[#9b8582]
                "
              />

              <div className="
                space-y-3
                px-3
              ">

                <label className="
                  flex
                  items-center
                  gap-2
                  font-serif
                  text-[11px]
                  text-[#665654]
                ">
                  <input
                    type="radio"
                    name="attending"
                    checked={attending === true}
                    onChange={() =>
                      setAttending(true)
                    }
                    className="accent-[#7b6664]"
                  />

                  Қатысамын
                </label>

                <label className="
                  flex
                  items-center
                  gap-2
                  font-serif
                  text-[11px]
                  text-[#665654]
                ">
                  <input
                    type="radio"
                    name="attending"
                    checked={attending === false}
                    onChange={() =>
                      setAttending(false)
                    }
                    className="accent-[#7b6664]"
                  />

                  Өкінішке орай, бара алмаймын
                </label>

              </div>

              {message && (
                <motion.p
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="
                    text-center
                    font-serif
                    text-[11px]
                    text-[#695654]
                  "
                >
                  {message}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  mx-auto
                  block
                  bg-[#403b3a]
                  px-10
                  py-3
                  font-serif
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  text-white
                  transition
                  hover:bg-[#544d4b]
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Жіберілуде..."
                  : "ЖІБЕРУ"}
              </button>

            </form>

          </div>

        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="
          relative
          overflow-hidden
          bg-[#f4dce1]
          px-8
          pb-16
          pt-4
          text-center
        ">

          <div className="
            absolute
            bottom-0
            left-0
            right-0
          ">
            <WatercolorBottom />
          </div>

          <div className="relative z-10">

            <p className="
              font-serif
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-[#75625f]
            ">
              Тойымызда жүздескенше!
            </p>

            <p className="
              mt-5
              font-wedding
              text-[30px]
              text-[#80655f]
            ">
              {data.groom} & {data.bride}
            </p>

          </div>

        </footer>

      </div>

    </main>
  );
}

/* =========================================================
   WEDDING CALENDAR
========================================================= */

function WeddingCalendar({
  date,
}: {
  date: string;
}) {
  const parsed = parseWeddingDate(date);

  const weekdays = [
    "Дс",
    "Сс",
    "Ср",
    "Бс",
    "Жм",
    "Сб",
    "Жс",
  ];

  const firstDay = new Date(
    parsed.year,
    parsed.monthIndex,
    1
  );

  const startDay =
    (firstDay.getDay() + 6) % 7;

  const daysInMonth = new Date(
    parsed.year,
    parsed.monthIndex + 1,
    0
  ).getDate();

  const calendarDays: (
    number | null
  )[] = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  return (
    <div className="
      mx-auto
      mt-7
      w-full
      max-w-[330px]
    ">

      <p className="
        font-wedding
        text-[31px]
        text-[#80655f]
      ">
        {parsed.month}
      </p>

      <p className="
        mt-1
        font-serif
        text-[10px]
        tracking-[0.2em]
        text-[#95827c]
      ">
        {parsed.year}
      </p>

      <div className="
        mt-6
        rounded-[28px]
        border
        border-[#e7d3d5]
        bg-white/50
        p-5
      ">

        <div className="
          grid
          grid-cols-7
          gap-y-3
        ">

          {weekdays.map((day) => (
            <div
              key={day}
              className="
                text-center
                font-serif
                text-[9px]
                uppercase
                text-[#9b8582]
              "
            >
              {day}
            </div>
          ))}

          {calendarDays.map(
            (day, index) => {

              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-9"
                  />
                );
              }

              const isWeddingDay =
                day === parsed.day;

              return (
                <div
                  key={day}
                  className="
                    relative
                    flex
                    h-9
                    items-center
                    justify-center
                  "
                >

                  {isWeddingDay && (
                    <Heart
                      size={35}
                      weight="fill"
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        text-[#e5a6b3]
                      "
                    />
                  )}

                  <span
                    className={`
                      relative
                      z-10
                      font-serif
                      text-[11px]
                      ${
                        isWeddingDay
                          ? "font-semibold text-white"
                          : "text-[#6f605c]"
                      }
                    `}
                  >
                    {day}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </div>

      <div className="mt-6 text-center">

        <p className="
          font-serif
          text-[10px]
          uppercase
          tracking-[0.18em]
          text-[#8b7873]
        ">
          Той басталуы
        </p>

        <p className="
          mt-2
          font-wedding
          text-[27px]
          text-[#80655f]
        ">
          {date}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   DATE PARSER
========================================================= */

function parseWeddingDate(date: string) {
  const months: Record<string, number> = {
    // Қазақша
    қаңтар: 0,
    ақпан: 1,
    наурыз: 2,
    сәуір: 3,
    мамыр: 4,
    маусым: 5,
    шілде: 6,
    тамыз: 7,
    қыркүйек: 8,
    қазан: 9,
    қараша: 10,
    желтоқсан: 11,

    // Русский
    январь: 0,
    января: 0,
    февраль: 1,
    февраля: 1,
    март: 2,
    марта: 2,
    апрель: 3,
    апреля: 3,
    май: 4,
    мая: 4,
    июнь: 5,
    июня: 5,
    июль: 6,
    июля: 6,
    август: 7,
    августа: 7,
    сентябрь: 8,
    сентября: 8,
    октябрь: 9,
    октября: 9,
    ноябрь: 10,
    ноября: 10,
    декабрь: 11,
    декабря: 11,
  };

  const monthNames = [
    "Қаңтар",
    "Ақпан",
    "Наурыз",
    "Сәуір",
    "Мамыр",
    "Маусым",
    "Шілде",
    "Тамыз",
    "Қыркүйек",
    "Қазан",
    "Қараша",
    "Желтоқсан",
  ];

  const normalized = date
    .trim()
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, " ");

  // ==========================================
  // 15.08.2026
  // 15-08-2027
  // 15/08/2028
  // ==========================================

  const numericMatch = normalized.match(
    /^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/
  );

  if (numericMatch) {
    const day = Number(numericMatch[1]);
    const monthIndex = Number(numericMatch[2]) - 1;
    const year = Number(numericMatch[3]);

    if (
      monthIndex >= 0 &&
      monthIndex <= 11
    ) {
      return {
        day,
        monthIndex,
        month: monthNames[monthIndex],
        year,
      };
    }
  }

  // ==========================================
  // 15 августа 2026
  // 15 августа 2027
  // 15 тамыз 2028
  // ==========================================

  const textMatch = normalized.match(
    /^(\d{1,2})\s+([а-яёәғқңөұүіһ]+)\s+(\d{4})$/
  );

  if (textMatch) {
    const day = Number(textMatch[1]);
    const monthName = textMatch[2];
    const year = Number(textMatch[3]);

    const monthIndex = months[monthName];

    if (
      monthIndex !== undefined &&
      year >= 1900
    ) {
      return {
        day,
        monthIndex,
        month: monthNames[monthIndex],
        year,
      };
    }
  }

  // ==========================================
  // FALLBACK
  // ==========================================

  console.warn(
    "⚠️ Не удалось распознать дату:",
    date
  );

  const now = new Date();

  return {
    day: now.getDate(),
    monthIndex: now.getMonth(),
    month: monthNames[now.getMonth()],
    year: now.getFullYear(),
  };
}

/* =========================================================
   COUNTDOWN
========================================================= */

function CountdownNumber({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="text-center">

      <p className="
        font-serif
        text-[25px]
        italic
        text-[#655653]
      ">
        {String(value).padStart(2, "0")}
      </p>

      <p className="
        mt-1
        font-serif
        text-[8px]
        uppercase
        tracking-[0.1em]
        text-[#897572]
      ">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   DRESS COLOR
========================================================= */

function DressColor({
  color,
}: {
  color: string;
}) {
  return (
    <span
      className="
        h-8
        w-8
        rounded-full
        shadow-sm
      "
      style={{
        backgroundColor: color,
      }}
    />
  );
}

/* =========================================================
   TOP WATERCOLOR
========================================================= */

function WatercolorTop() {
  return (
    <div className="
      pointer-events-none
      absolute
      left-0
      right-0
      top-0
      h-[310px]
      overflow-hidden
    ">

      <div className="
        absolute
        left-[-45px]
        top-[-70px]
        h-[220px]
        w-[330px]
        rotate-[-12deg]
        rounded-[45%]
        bg-[#f2b7c3]/55
        blur-[18px]
      " />

      <div className="
        absolute
        right-[-80px]
        top-[-90px]
        h-[220px]
        w-[300px]
        rotate-[15deg]
        rounded-[50%]
        bg-[#f5c9d1]/45
        blur-[20px]
      " />

      <Leaf className="
        absolute
        left-[18px]
        top-[20px]
        rotate-[-20deg]
      " />

      <Leaf className="
        absolute
        left-[55px]
        top-[45px]
        rotate-[20deg]
      " />

      <Leaf className="
        absolute
        right-[35px]
        top-[40px]
        rotate-[-15deg]
      " />

      <Flower
        className="
          absolute
          left-[30px]
          top-[105px]
        "
        size={54}
      />

      <Flower
        className="
          absolute
          right-[35px]
          top-[85px]
        "
        size={65}
      />

      <Flower
        className="
          absolute
          left-[125px]
          top-[10px]
        "
        size={38}
      />

      <Flower
        className="
          absolute
          right-[135px]
          top-[10px]
        "
        size={34}
      />

    </div>
  );
}

/* =========================================================
   BOTTOM FLOWERS
========================================================= */

function BottomFlowers() {
  return (
    <div className="
      relative
      h-[120px]
      w-full
    ">

      <Flower
        className="
          absolute
          bottom-2
          left-[20px]
        "
        size={48}
      />

      <Flower
        className="
          absolute
          bottom-1
          left-[75px]
        "
        size={34}
      />

      <Flower
        className="
          absolute
          bottom-0
          left-[135px]
        "
        size={58}
      />

      <Flower
        className="
          absolute
          bottom-3
          right-[110px]
        "
        size={42}
      />

      <Flower
        className="
          absolute
          bottom-0
          right-[45px]
        "
        size={58}
      />

      <Leaf className="
        absolute
        bottom-8
        left-[180px]
        rotate-[-25deg]
      " />

      <Leaf className="
        absolute
        bottom-12
        right-[175px]
        rotate-[30deg]
      " />

      <Dragonfly className="
        absolute
        right-[25px]
        top-[10px]
      " />

      <Dragonfly className="
        absolute
        left-[155px]
        top-[20px]
      " />

    </div>
  );
}

/* =========================================================
   FLORAL DIVIDER
========================================================= */

function FloralDivider() {
  return (
    <div className="
      absolute
      bottom-[260px]
      left-0
      right-0
      z-10
      h-[160px]
    ">

      <Flower
        className="
          absolute
          bottom-3
          left-[15px]
        "
        size={45}
      />

      <Flower
        className="
          absolute
          bottom-0
          left-[70px]
        "
        size={58}
      />

      <Flower
        className="
          absolute
          bottom-[-2px]
          left-[125px]
        "
        size={35}
      />

      <Flower
        className="
          absolute
          bottom-0
          right-[110px]
        "
        size={55}
      />

      <Flower
        className="
          absolute
          bottom-2
          right-[45px]
        "
        size={43}
      />

      <Dragonfly className="
        absolute
        left-[165px]
        top-[20px]
      " />

      <Dragonfly className="
        absolute
        right-[25px]
        top-[5px]
      " />

    </div>
  );
}

/* =========================================================
   FLOWER
========================================================= */

function Flower({
  size = 50,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        fill="none"
      >

        <ellipse
          cx="50"
          cy="28"
          rx="19"
          ry="28"
          fill="#e8a9b5"
          opacity=".62"
        />

        <ellipse
          cx="72"
          cy="47"
          rx="19"
          ry="28"
          transform="rotate(65 72 47)"
          fill="#dba2ae"
          opacity=".58"
        />

        <ellipse
          cx="63"
          cy="73"
          rx="19"
          ry="28"
          transform="rotate(130 63 73)"
          fill="#f1c3cb"
          opacity=".7"
        />

        <ellipse
          cx="35"
          cy="73"
          rx="19"
          ry="28"
          transform="rotate(220 35 73)"
          fill="#e7b0bb"
          opacity=".58"
        />

        <ellipse
          cx="28"
          cy="47"
          rx="19"
          ry="28"
          transform="rotate(295 28 47)"
          fill="#f3c6ce"
          opacity=".62"
        />

        <circle
          cx="50"
          cy="50"
          r="10"
          fill="#c99872"
          opacity=".8"
        />

        <circle
          cx="47"
          cy="47"
          r="3"
          fill="#fff1d8"
        />

        <path
          d="M50 60C48 76 44 87 35 98"
          stroke="#8ea27c"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M42 78C31 72 22 75 16 83"
          stroke="#8ea27c"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M45 72C55 67 63 68 71 75"
          stroke="#9aaa86"
          strokeWidth="3"
          strokeLinecap="round"
        />

      </svg>
    </div>
  );
}

/* =========================================================
   LEAF
========================================================= */

function Leaf({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>

      <svg
        width="65"
        height="65"
        viewBox="0 0 100 100"
        fill="none"
      >

        <path
          d="M48 90C48 62 48 34 62 10"
          stroke="#8da27c"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M51 61C37 48 24 45 12 48C24 60 37 65 51 61Z"
          fill="#9fb18d"
          opacity=".7"
        />

        <path
          d="M51 45C64 31 78 30 90 34C79 47 65 51 51 45Z"
          fill="#a9b897"
          opacity=".68"
        />

        <path
          d="M49 73C37 65 27 65 19 70C29 80 39 80 49 73Z"
          fill="#91a580"
          opacity=".62"
        />

      </svg>

    </div>
  );
}

/* =========================================================
   DRAGONFLY
========================================================= */

function Dragonfly({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>

      <svg
        width="45"
        height="45"
        viewBox="0 0 100 100"
        fill="none"
      >

        <path
          d="M50 18V82"
          stroke="#7594aa"
          strokeWidth="3"
        />

        <ellipse
          cx="34"
          cy="34"
          rx="12"
          ry="25"
          transform="rotate(-35 34 34)"
          fill="#7da6c2"
          opacity=".65"
        />

        <ellipse
          cx="66"
          cy="34"
          rx="12"
          ry="25"
          transform="rotate(35 66 34)"
          fill="#7da6c2"
          opacity=".65"
        />

        <ellipse
          cx="34"
          cy="65"
          rx="9"
          ry="19"
          transform="rotate(35 34 65)"
          fill="#98b9cc"
          opacity=".6"
        />

        <ellipse
          cx="66"
          cy="65"
          rx="9"
          ry="19"
          transform="rotate(-35 66 65)"
          fill="#98b9cc"
          opacity=".6"
        />

        <circle
          cx="50"
          cy="14"
          r="4"
          fill="#6e8898"
        />

      </svg>

    </div>
  );
}

/* =========================================================
   BRANCH
========================================================= */

function BranchDivider() {
  return (
    <svg
      width="145"
      height="40"
      viewBox="0 0 145 40"
      fill="none"
    >

      <path
        d="M15 22C40 19 62 19 75 20C91 21 109 19 130 13"
        stroke="#9ba886"
        strokeWidth="1.5"
      />

      <path
        d="M35 19C31 12 26 9 20 9"
        stroke="#9ba886"
        strokeWidth="1.5"
      />

      <path
        d="M52 20C48 12 45 8 39 7"
        stroke="#9ba886"
        strokeWidth="1.5"
      />

      <path
        d="M91 20C95 12 100 8 107 7"
        stroke="#9ba886"
        strokeWidth="1.5"
      />

      <path
        d="M108 19C113 11 119 9 125 10"
        stroke="#9ba886"
        strokeWidth="1.5"
      />

      <circle
        cx="73"
        cy="20"
        r="3"
        fill="#c99978"
      />

    </svg>
  );
}

/* =========================================================
   DRESS FLOWERS
========================================================= */

function DressCodeFlowers() {
  return (
    <div className="
      pointer-events-none
      absolute
      inset-0
    ">

      <Flower
        className="
          absolute
          bottom-0
          left-[-10px]
        "
        size={95}
      />

      <Flower
        className="
          absolute
          bottom-0
          right-[-10px]
        "
        size={90}
      />

      <Flower
        className="
          absolute
          left-[80px]
          top-[-20px]
        "
        size={50}
      />

      <Flower
        className="
          absolute
          right-[70px]
          top-[-15px]
        "
        size={48}
      />

      <Dragonfly className="
        absolute
        right-[20px]
        top-[45px]
      " />

    </div>
  );
}

/* =========================================================
   WATER COLORS
========================================================= */

function PinkWatercolor() {
  return (
    <svg
      width="190"
      height="190"
      viewBox="0 0 190 190"
      fill="none"
      className="opacity-60"
    >

      <path
        d="M15 105C30 50 87 20 144 37C180 48 184 103 151 135C119 166 42 170 18 137C10 126 8 116 15 105Z"
        fill="#efaeba"
        opacity=".4"
      />

      <path
        d="M28 115C46 67 89 45 137 57C163 64 165 105 139 126C109 151 52 150 32 133C24 126 23 121 28 115Z"
        fill="#e89eac"
        opacity=".25"
      />

    </svg>
  );
}

function SmallFlower() {
  return (
    <div className="opacity-60">
      <Flower size={85} />
    </div>
  );
}

function SoftFlower() {
  return (
    <div className="opacity-40">
      <Flower size={130} />
    </div>
  );
}

function WatercolorBottom() {
  return (
    <div className="relative h-[120px]">

      <div className="
        absolute
        bottom-[-90px]
        left-[-20%]
        h-[180px]
        w-[140%]
        rounded-[50%]
        bg-[#f0b7c2]/50
        blur-2xl
      " />

      <Flower
        className="
          absolute
          bottom-0
          left-[15px]
        "
        size={50}
      />

      <Flower
        className="
          absolute
          bottom-0
          right-[25px]
        "
        size={55}
      />

    </div>
  );
}