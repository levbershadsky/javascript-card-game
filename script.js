class CardGame {
      constructor() {
                this.playerHand = [];
                this.dealerHand = [];
                this.playerScore = 0;
                this.dealerScore = 0;
                this.gameOver = false;
                this.playerWins = 0;
                this.dealerWins = 0;
                this.ties = 0;

          this.setupEventListeners();
                this.loadStats();
      }

    setupEventListeners() {
              document.getElementById('dealBtn').addEventListener('click', () => this.deal());
              document.getElementById('hitBtn').addEventListener('click', () => this.playerHit());
              document.getElementById('standBtn').addEventListener('click', () => this.playerStand());
              document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }

    deal() {
              if (this.gameOver) return;

          this.resetHands();

          this.playerHand.push(this.drawCard());
              this.playerHand.push(this.drawCard());

          this.dealerHand.push(this.drawCard());
              this.dealerHand.push(this.drawCard());

          this.updateScores();
              this.render();

          document.getElementById('dealBtn').disabled = true;
              document.getElementById('hitBtn').disabled = false;
              document.getElementById('standBtn').disabled = false;

          this.gameOver = false;
              this.checkInitialBlackjack();
    }

    drawCard() {
              return Math.floor(Math.random() * 10) + 1;
    }

    playerHit() {
              if (this.gameOver) return;

          this.playerHand.push(this.drawCard());
              this.updateScores();
              this.render();

          if (this.playerScore > 10) {
                        this.endGame('Player Bust! Dealer Wins! 💔');
          }
    }

    playerStand() {
              if (this.gameOver) return;

          document.getElementById('hitBtn').disabled = true;
              document.getElementById('standBtn').disabled = true;

          while (this.dealerScore < 6 && this.dealerScore < this.playerScore) {
                        this.dealerHand.push(this.drawCard());
                        this.updateScores();
          }

          this.render();
              this.determineWinner();
    }

    checkInitialBlackjack() {
              if (this.playerScore > 10) {
                            this.endGame('Player Bust! Dealer Wins! 💔');
              } else if (this.dealerScore > 10) {
                            this.endGame('Dealer Bust! You Win! 🎉');
              }
    }

    determineWinner() {
              const playerPerfect = this.isTargetScore(this.playerScore);
              const dealerPerfect = this.isTargetScore(this.dealerScore);

          if (this.playerScore > 10) {
                        this.endGame('Player Bust! Dealer Wins! 💔');
          } else if (this.dealerScore > 10) {
                        this.endGame('Dealer Bust! You Win! 🎉');
          } else if (playerPerfect && dealerPerfect) {
                        this.endGame("Both Hit 6-7! It's a Tie! 🤝");
          } else if (playerPerfect) {
                        this.endGame('You Hit 6-7! You Win! 🎉');
          } else if (dealerPerfect) {
                        this.endGame('Dealer Hit 6-7! Dealer Wins! 💔');
          } else if (this.playerScore > this.dealerScore) {
                        this.endGame('You Win! 🎉');
          } else if (this.dealerScore > this.playerScore) {
                        this.endGame('Dealer Wins! 💔');
          } else {
                        this.endGame("It's a Tie! 🤝");
          }
    }

    isTargetScore(score) {
              return score === 6 || score === 7;
    }

    endGame(message) {
              this.gameOver = true;

          const statusElement = document.getElementById('gameStatus');
              statusElement.textContent = message;

          if (message.includes('You Win')) {
                        statusElement.className = 'game-status status-win';
                        this.playerWins++;
          } else if (message.includes("It's a Tie")) {
                        statusElement.className = 'game-status status-tie';
                        this.ties++;
          } else {
                        statusElement.className = 'game-status status-lose';
                        this.dealerWins++;
          }

          document.getElementById('hitBtn').disabled = true;
              document.getElementById('standBtn').disabled = true;
              document.getElementById('dealBtn').disabled = false;

          this.saveStats();
              this.updateStats();
    }

    updateScores() {
              this.playerScore = this.playerHand.reduce((sum, card) => sum + card, 0);
              this.dealerScore = this.dealerHand.reduce((sum, card) => sum + card, 0);
    }

    resetHands() {
              this.playerHand = [];
              this.dealerHand = [];
              this.playerScore = 0;
              this.dealerScore = 0;
              document.getElementById('gameStatus').textContent = '';
              document.getElementById('gameStatus').className = 'game-status';
    }

    resetGame() {
              this.resetHands();
              this.playerWins = 0;
              this.dealerWins = 0;
              this.ties = 0;
              this.gameOver = false;
              this.render();
              document.getElementById('dealBtn').disabled = false;
              document.getElementById('hitBtn').disabled = true;
              document.getElementById('standBtn').disabled = true;
              this.updateStats();
              this.saveStats();
    }

    render() {
              const playerCardsHTML = this.playerHand
                  .map((card, index) => `<div class="card" title="Card ${index + 1}">${card}</div>`)
                  .join('');
              document.getElementById('playerCards').innerHTML = playerCardsHTML;
              document.getElementById('playerScore').textContent = `Score: ${this.playerScore}`;

          const dealerCardsHTML = this.dealerHand
                  .map((card, index) => `<div class="card" title="Card ${index + 1}">${card}</div>`)
                  .join('');
              document.getElementById('dealerCards').innerHTML = dealerCardsHTML;
              document.getElementById('dealerScore').textContent = `Score: ${this.dealerScore}`;
    }

    updateStats() {
              document.getElementById('playerWins').textContent = this.playerWins;
              document.getElementById('dealerWins').textContent = this.dealerWins;
              document.getElementById('ties').textContent = this.ties;
    }

    saveStats() {
              const stats = {
                            playerWins: this.playerWins,
                            dealerWins: this.dealerWins,
                            ties: this.ties
              };
              localStorage.setItem('cardGameStats', JSON.stringify(stats));
    }

    loadStats() {
              const saved = localStorage.getItem('cardGameStats');
              if (saved) {
                            const stats = JSON.parse(saved);
                            this.playerWins = stats.playerWins || 0;
                            this.dealerWins = stats.dealerWins || 0;
                            this.ties = stats.ties || 0;
                            this.updateStats();
              }
    }
}

document.addEventListener('DOMContentLoaded', () => {
      new CardGame();
});
