javascript:(function(){
  console.log("[BOOKMARKLET] Loaded");

  // ------------------- See correct -------------------
  setTimeout(() => {
    if (typeof settings === "undefined") window.settings = {};
    settings.see_correct = true;
    console.log("[BOOKMARKLET] see_correct enabled after 5s");
  }, 5000);

  // ------------------- Popup -------------------
  function showPopup(text){
    const p=document.createElement("div");
    p.style.position="fixed";
    p.style.top="10px";
    p.style.left="10px";
    p.style.background="white";
    p.style.padding="8px 12px";
    p.style.border="1px solid black";
    p.style.zIndex=999999;
    p.style.fontSize="14px";
    p.style.boxShadow="0 3px 10px rgba(0,0,0,0.3)";
    p.textContent=text;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),3000);
  }

  // ------------------- Helpers -------------------
  function getQuestionText(){const e=document.querySelector("#question-input");return e?e.textContent.trim():null;}
  function getStorageKey(){const q=getQuestionText();return q?"answer_"+q.toLowerCase():null;}

  // ------------------- Manual Answer Box -------------------
  function createManualAnswerBox(){
    if(document.getElementById("manual-answer-box")) return;
    const box=document.createElement("div");
    box.id="manual-answer-box";
    box.style.position="fixed";
    box.style.top="50px";
    box.style.left="10px";
    box.style.background="white";
    box.style.border="1px solid black";
    box.style.padding="10px";
    box.style.zIndex=999999;
    box.style.width="220px";
    box.style.boxShadow="0 3px 10px rgba(0,0,0,0.3)";
    const input=document.createElement("input");
    input.type="text";
    input.placeholder="Type answer…";
    input.style.width="100%";
    input.style.marginBottom="6px";
    const btn=document.createElement("button");
    btn.textContent="Set Answer";
    btn.style.width="100%";
    btn.style.cursor="pointer";
    btn.onclick=()=>{
      const key=getStorageKey();
      if(!key)return showPopup("No question detected");
      const value=input.value.trim();
      if(!value)return showPopup("Enter an answer first");
      localStorage.setItem(key,value);
      showPopup("Answer saved");
      const answerInput=document.querySelector("#answer-input");
      if(answerInput){
        answerInput.value=value;
        answerInput.dispatchEvent(new Event("input",{bubbles:true}));
        answerInput.dispatchEvent(new Event("change",{bubbles:true}));
      }
    };
    box.appendChild(input);
    box.appendChild(btn);
    document.body.appendChild(box);
  }

  // ------------------- Main Logic -------------------
  let lastQuestion="";
  function handleQuestionChange(){
    const text=getQuestionText();
    if(!text||text===lastQuestion)return;
    lastQuestion=text;
    console.log("[BOOKMARKLET] Question:",text);
    createManualAnswerBox();
    const key="answer_"+text.toLowerCase();
    const saved=localStorage.getItem(key);
    const answerInput=document.querySelector("#answer-input");
    if(saved){
      showPopup("Using saved answer");
      if(answerInput){
        answerInput.value=saved;
        answerInput.dispatchEvent(new Event("input",{bubbles:true}));
        answerInput.dispatchEvent(new Event("change",{bubbles:true}));
      }
    }
  }

  // ------------------- Observe Question Changes -------------------
  const observer=new MutationObserver(handleQuestionChange);
  const target=document.querySelector("#question-input");
  if(target){
    observer.observe(target,{childList:true,subtree:true});
    console.log("[BOOKMARKLET] Observer attached");
  }

  // Initial run
  setTimeout(handleQuestionChange,500);
})();
