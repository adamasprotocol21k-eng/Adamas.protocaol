function generateReferral(){

let link = window.location.href + "?ref=USER"

document.getElementById("refLink").value = link

}

function copyReferral(){

let ref = document.getElementById("refLink")

ref.select()

document.execCommand("copy")

alert("Referral link copied")

}

generateReferral()
