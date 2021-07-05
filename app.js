function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    playerBarStyle() {
      return this.playerHealth <= 0
        ? { width: 0 + "%" }
        : { width: this.playerHealth + "%" };
    },
    monsterBarStyle() {
      return this.monsterHealth <= 0
        ? { width: 0 + "%" }
        : { width: this.monsterHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 != 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    addLogMessage(who, what, value) {
      const obj = {
        actionBy: who,
        actionType: what,
        actionValue: value,
      };
      this.logMessages.unshift(obj);
    },
    surrender() {
      this.winner = "monster";
    },
    startGame() {
      this.winner = null;
      this.currentRound = 0;
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.logMessages = [];
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.addLogMessage("player", "heal", healValue);
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
        this.addLogMessage("player", "heal", healValue);
      }
      this.attackPlayer();
    },
    specialAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "special attack", attackValue);
      this.attackPlayer();
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.addLogMessage("monster", "attack", attackValue);
      this.playerHealth -= attackValue;
    },
  },
});

app.mount("#game");
