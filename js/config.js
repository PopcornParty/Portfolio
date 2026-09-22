/* ============================================================
   Popcorn Party — easy-to-edit site constants
   Change these values first. Everything else reads from here.
   ============================================================ */

const SITE = {
  name: "Popcorn Party",
  shortName: "Popcorn",
  tagline: "Developer • Creator • Community Builder",
  discordUsername: "popcorn_party1",

  // Paste your real channel URLs here when you have them.
  youtubeUrl: "https://youtube.com/@popcorn_party1?si=F_LOqwdQSwE4uVtP",
  instagramUrl: "https://www.instagram.com/popcorn_partyig?stkn=MTEzcW9rdDJjbm1ueg%3D%3D&utm_source=qr",

  youtubeLabel: "Popcorn Party",
  instagramLabel: "Instagram",

  communities: [
    {
      title: "Server Owners Community",
      description: "A community for people who own and run Discord/Minecraft servers.",
      button: "Join Discord",
      url: "https://discord.gg/qpQCgSARFW",
    },
    {
      title: "My Discord",
      description: "My own Discord community.",
      button: "Join My Server",
      url: "https://discord.gg/Upqn53jKJP",
    },
    {
      title: "Donut Nation",
      description: "A Discord community I’m involved with.",
      button: "Join Donut Nation",
      url: "https://discord.gg/donutnation",
    },
  ],

  /* Unique public key for the keyless visit counter.
     Change this if you ever want to reset the global count. */
  visitCounterKey: "popcornparty-portfolio-visits-v1",
};

window.SITE = SITE;
