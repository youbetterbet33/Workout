let routine=[]
let current=0
let timerInterval

function vibrate(pattern){
if(navigator.vibrate){
navigator.vibrate(pattern)
}
}

function addExercise(){

const name=document.getElementById("name").value
const time=parseInt(document.getElementById("time").value)
const sides=document.getElementById("sides").checked
const rest=parseInt(document.getElementById("rest").value)||0
const file=document.getElementById("photo").files[0]

const reader=new FileReader()

reader.onload=function(){

const exercise={
name,
time,
sides,
rest,
image:reader.result
}

routine.push(exercise)

saveRoutine()
renderRoutine()

}

if(file){
reader.readAsDataURL(file)
}else{
reader.onload()
}
}

function renderRoutine(){

const container=document.getElementById("routine")
container.innerHTML=""

routine.forEach(e=>{

const div=document.createElement("div")
div.className="exerciseItem"

div.innerHTML=`${e.name} - ${e.time}s`

container.appendChild(div)

})
}

function startWorkout(){

current=0
runExercise()

}

function runExercise(){

if(current>=routine.length){
alert("Workout complete!")
return
}

const ex=routine[current]

document.getElementById("exerciseTitle").innerText=ex.name
document.getElementById("exerciseImg").src=ex.image

let remaining=ex.time
let half=Math.floor(ex.time/2)

vibrate([300,100,300])

updateTimer(remaining)

timerInterval=setInterval(()=>{

remaining--

if(ex.sides && remaining===half){
vibrate([200,100,200])
}

updateTimer(remaining)

if(remaining<=0){
clearInterval(timerInterval)

if(ex.rest>0){
runRest(ex.rest)
}else{
current++
runExercise()
}

}

},1000)

}

function runRest(seconds){

document.getElementById("exerciseTitle").innerText="Rest"
document.getElementById("exerciseImg").src=""

vibrate([500,200,500])

let remaining=seconds
updateTimer(remaining)

timerInterval=setInterval(()=>{

remaining--
updateTimer(remaining)

if(remaining<=0){
clearInterval(timerInterval)
current++
runExercise()
}

},1000)

}

function updateTimer(t){
document.getElementById("timer").innerText=t
}

function saveRoutine(){
localStorage.setItem("routine",JSON.stringify(routine))
}

function loadRoutine(){

const saved=localStorage.getItem("routine")

if(saved){
routine=JSON.parse(saved)
renderRoutine()
}

}

loadRoutine()
