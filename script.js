javascript:(function(){
  setTimeout(()=>{
    if(typeof settings==="undefined") window.settings={};
    settings.see_correct=true;
    console.log("[BOOKMARKLET] see_correct enabled after 5s");
  },0001);
})();
