// 2. Create the player object. Give it two keys, name and chips, and set their values

let	nDecksinputEl = document.getElementById("ndecksinput-el")
let	betSizeInputEl = document.getElementById("betsizeinput-el")
let	cardsLeftEl = document.getElementById("cardsleft-el")
let	decksLeftEl = document.getElementById("decksleft-el")
let	handValueEl = document.getElementById("handvalue-el")
let	runningCountEl = document.getElementById("runningcount-el")
let	trueCountEl = document.getElementById("truecount-el")
let	betValueEl = document.getElementById("betvalue-el")
let	testEl = document.getElementById("test-el")
let	hitOddEl = document.getElementById("hitodd-el")
// testEl.textContent = "test"


let	nDecks
let	cardsLeft
let	allCards = []
let	nEachCard = [13]
let	runningCount
let	trueCount
let	betSize
let	handValue
let	remainingCardValues = []
let	totalCurrentCards = 0

function initEachCard() {
	for(let i = 0; i < 13; i++)
		nEachCard[i] = 4 * nDecks
}

//remainingCardValue[index] == numberofcards with value (index + 2)
function initDecks() {
	allCards.push(20 * nDecks, 12 * nDecks, 20 * nDecks)

	for(let i = 0; i < 10; i++) {
		remainingCardValues[i] = 4 * nDecks
		if (i == 8)
			remainingCardValues[i] *= 4
	}
}

//is hit worth it


function updateCards() {
	nDecks = Math.round(cardsLeft / 52 * 1000) / 1000
	betSize = betSizeInputEl.value
	decksLeftEl.textContent = "Number of Decks Left: " + nDecks
	cardsLeftEl.textContent = "Number of Cards Left: " + cardsLeft
	shouldHit()
	for(let i = 0; i < nEachCard.length; i++)
	{
		document.getElementById("nc" + (i + 2)).textContent = nEachCard[i]
		document.getElementById("odd" + (i + 2)).textContent = (Math.round(nEachCard[i] / cardsLeft * 10000) / 100) + " %"
	}
}

function newGame() {
	enableButtons()
	newHand()
	runningCount = 0
	trueCount = 0
	runningCountEl.textContent = "Running Count: 0"
	trueCountEl.textContent = "True Count: 0"
	enableButtons()
}

function newHand() {
	enablePlayerButtons()
	updatePlayerButtonStatus()
	handValue = 0
	handValueEl.textContent = "Hand Value: 0"
}

function updatePlayerButtonStatus()
{
	for(var i = 0; i < nEachCard.length; i++)
	{
		if (nEachCard[i] == 0)
			document.getElementById("pb" + (i + 2)).disabled = true
	}
}

function renderGame() {
	// if (cardsLeftEl % 52 == 0)
	nDecks = nDecksinputEl.value
	cardsLeft = nDecks * 52
	if (nDecks > 0 && betSizeInputEl.value > 0)
	{
		testEl.textContent = ""
		newGame()
		initEachCard()
		updateCards()
		initDecks()
	}
	else
		testEl.textContent = "Bet Size and Number of Decks must be > 0"
}

function count(value) {
	allCards[value]--
	if (value == 0)
		runningCount++
	if (value == 2)
		runningCount--
	runningCountEl.textContent = "Running Count: " + runningCount
	trueCount = Math.round(runningCount / nDecks * 1000) / 1000
	trueCountEl.textContent = "True Count: " + trueCount
	if (trueCount < 1)
		betValueEl.textContent = "Bet: " + betSize
	else
		betValueEl.textContent = "Bet: " + Math.round(betSize * 2 * trueCount)
}

function enableButtons() {
	enablePlayerButtons()
	enableCardButtons()
	document.getElementsByName("newhandbtn")[0].disabled = false
}

function enableCardButtons() {
	var	cardButtons = document.getElementsByName("cardbutton")
	for(var i = 0; i < cardButtons.length; i++) {
		cardButtons[i].disabled = false;
	}
}

function enablePlayerButtons() {
	var	playerButtons = document.getElementsByName("playerbutton")
	for(var i = 0; i < playerButtons.length; i++) {
		playerButtons[i].disabled = false;
	}
}

function disablePlayerButtons() {
	var	playerButtons = document.getElementsByName("playerbutton")
	for(var i = 0; i < playerButtons.length; i++) {
		playerButtons[i].disabled = true;
	}
}

function getHandValue(card) {
	cardCount(card)
	if (card < 10)
		handValue += card
	else if (card == 14)
		handValue += 11
	else
		handValue += 10
	if (handValue < 21)
	{
		handValueEl.textContent = "Hand Value: " + handValue
	}
	else if (handValue == 21) {
		handValueEl.textContent = "You have Blackjack! You win :)"
		disablePlayerButtons()
	}
	else {
		handValueEl.textContent = "Hand lost :("
		disablePlayerButtons()
	}
}

function cardCount(card) {
	if (nEachCard[card - 2] > 0) {
		if (card < 7)
			count(0)
		else if (card > 9)
			count(2)
		else
			count(1)
		cardsLeft--;
		nEachCard[card - 2]--
		updateCards()
	}
	if (nEachCard[card - 2] == 0) {
		document.getElementById("pb" + card).disabled = true
		document.getElementById("b" + card).disabled = true
	}
}

function shouldHit() {
	let valueLeft = 21 - handValue
	let sumOdd = 100
	let sum = 0
	if (valueLeft < 2)
		sumOdd = 0
	else if (valueLeft > 11)
		sumOdd = 100
	else {
		for (let i = 2; i < valueLeft; i++)
			sum += nEachCard[i - 2]
		sumOdd = Math.round(sum / cardsLeft * 10000) / 100
	}
	if (sumOdd > 50)
		hitOddEl.style.background="#00FF0F"
	else
		hitOddEl.style.background="red"
	hitOddEl.textContent = sumOdd + " %"
}
