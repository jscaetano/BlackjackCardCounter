// 2. Create the player object. Give it two keys, name and chips, and set their values

// First collumn elements
let	runningCountEl = document.getElementById("runningCount-el")
let	trueCountEl = document.getElementById("trueCount-el")
let	currBetValueEl = document.getElementById("currBetValue-el")
let	lastEntryBetEl = document.getElementById("lastEntryBet-el")

let	nCardsLeftEl = document.getElementById("nCardsLeft-el")
let	nDecksLeftEl = document.getElementById("nDecksLeft-el")

let	hitChanceEl = document.getElementById("hitChance-el")

// Second collumn elements
// Inputs
let	betSizeInputEl = document.getElementById("betSizeInput-el")
let	nDecksInputEl = document.getElementById("nDecksInput-el")

let	currHandValueEl = document.getElementById("currHandValue-el")

let	recommendedMoveEl = document.getElementById("recommendedMove-el")
let	recommendedMove2El = document.getElementById("recommendedMove2-el")


let	testEl = document.getElementById("test-el")
// testEl.textContent = "test"

// First collumn vars
let	runningCount
let	trueCount
let	lastEntryBet = betSizeInputEl.value
let	betSizeInit = betSizeInputEl.value

let	nDecks
let	nCardsLeft

let	hitSuccessChance = 100

//Second collumn vars
let	handValue = 0


// let	allCards = []
let	nEachCard = [13]
let	betSize
let	remainingCardValues = []
let	totalCurrentCards = 0
let	nPlayerCards = 0
let split = ""


function initEachCard() {
	for(let i = 0; i < 13; i++)
		nEachCard[i] = 4 * nDecks
}

//remainingCardValue[index] == numberofcards with value (index + 2)
function initDecks() {
	initEachCard()
	// allCards.push(20 * nDecks, 12 * nDecks, 20 * nDecks)

	for(let i = 0; i < 10; i++) {
		remainingCardValues[i] = 4 * nDecks
		if (i == 8)
			remainingCardValues[i] *= 4
	}
}

//is hit worth it

function updateCards() {
	nDecks = Math.round(nCardsLeft / 52 * 1000) / 1000
	nDecksLeftEl.textContent = "Number of Decks Left: " + nDecks
	nCardsLeftEl.textContent = "Number of Cards Left: " + nCardsLeft
	shouldSplit()
	for(let i = 0; i < nEachCard.length; i++)
	{
		document.getElementById("nc" + (i + 2)).textContent = nEachCard[i]
		document.getElementById("odd" + (i + 2)).textContent = (Math.round(nEachCard[i] / nCardsLeft * 10000) / 100) + " %"
	}
}

function updatePlayerButtonStatus()
{
	for(var i = 0; i < nEachCard.length; i++)
		if (nEachCard[i] == 0)
			document.getElementById("pb" + (i + 2)).disabled = true
}

//betSize updates when a cardbutton is pressed
//lastEntrybet updates when newHand is pressed

function newHand() {
	enablePlayerButtons()
	updatePlayerButtonStatus()
	nPlayerCards = 0
	lastEntryBet = betSize
	currBetValueEl.textContent = "Bet: " + betSize
	lastEntryBetEl.textContent = "Last Round Entry Bet: " + lastEntryBet
	handValue = 0
	currHandValueEl.textContent = "Hand Value: 0"
}

function resetCounts() {
	recommendedMoveEl.textContent = ""
	recommendedMove2El.textContent = ""
	runningCount = 0
	trueCount = 0
	runningCountEl.textContent = "Running Count: 0"
	trueCountEl.textContent = "True Count: 0"
}

function initGame() {
	nDecks = nDecksInputEl.value
	nCardsLeft = nDecks * 52
	betSize = betSizeInputEl.value
	betSizeInit = betSizeInputEl.value
	if (nDecks > 0 && betSize > 0)
	{
		testEl.textContent = ""
		currBetValueEl.textContent = "Bet: " + betSize
		enableButtons()
		newHand()
		resetCounts()
		initDecks()
		updateCards()
	}
	else
		testEl.textContent = "Bet Size and Number of Decks must be > 0"
}

function count(value) {
	// allCards[value]--
	if (value == 0)
		runningCount++
	if (value == 2)
		runningCount--
	runningCountEl.textContent = "Running Count: " + runningCount
	trueCount = Math.round(runningCount / nDecks * 1000) / 1000
	trueCountEl.textContent = "True Count: " + trueCount
	betSize = Math.round(betSizeInit * 2 * trueCount)
	if (trueCount < 1)
		currBetValueEl.textContent = "Bet: " + betSize
	else {
		lastEntryBetEl.textContent = "Last Round Entry Bet: " + lastEntryBet
		currBetValueEl.textContent = "Bet: " + betSize
		shouldSplit()
	}
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
	nPlayerCards++
	cardCount(card)
	if (card < 10)
		handValue += card
	else if (card == 14)
		handValue += 11
	else
		handValue += 10
	if (handValue < 21)
		currHandValueEl.textContent = "Hand Value: " + handValue
	else if (handValue == 21) {
		currHandValueEl.textContent = "You have Blackjack! You win :)"
		disablePlayerButtons()
	}
	else {
		currHandValueEl.textContent = "Hand lost :("
		disablePlayerButtons()
	}
	shouldSplit()
}

function cardCount(card) {
	shouldSplit()
	if (nEachCard[card - 2] > 0) {
		if (card < 7)
			count(0)
		else if (card > 9)
			count(2)
		else
			count(1)
		nCardsLeft--;
		nEachCard[card - 2]--
		updateCards()
	}
	if (nEachCard[card - 2] == 0) {
		document.getElementById("pb" + card).disabled = true
		document.getElementById("b" + card).disabled = true
	}
}

function shouldSplit() {
	split = ""
	if (nPlayerCards == 2 && betSize > 2 * lastEntryBet) {
		split = "Split and "
	}
	shouldHit()
}

function shouldHit() {
	let valueLeft = 21 - handValue
	hitSuccessChance = 100
	let sum = 0
	if (valueLeft < 2)
		hitSuccessChance = 0
	else if (valueLeft > 11)
		hitSuccessChance = 100
	else {
		for (let i = 2; i <= valueLeft; i++)
			sum += nEachCard[i - 2]
		hitSuccessChance = Math.round(sum / nCardsLeft * 10000) / 100
	}
	if (hitSuccessChance > 50 && nPlayerCards > 1)
	{
		hitChanceEl.style.background="green"
		recommendedMove2El.textContent = "Recommended Move"
		recommendedMoveEl.textContent = split + "Hit"
	}
	else if (nPlayerCards > 1)
	{
		hitChanceEl.style.background="red"
		recommendedMove2El.textContent = "Recommended Move"
		recommendedMoveEl.textContent = split + "Stand"
	}
	hitChanceEl.textContent = hitSuccessChance + " %"
}

// // 2. Create the player object. Give it two keys, name and chips, and set their values
