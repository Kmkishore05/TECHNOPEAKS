let state = {
    candidates : [],
    votes : [],
    votingStarted : false,
    votingClosed : false
  }
  
  function getNominationForm(){
    return document.querySelector("#nomination");
  }
  
  function submitCandidate(evt){
    let nominationForm = getNominationForm();
    state.candidates.push(nominationForm.candidate.value);
    refreshCandidates();
    clearCandidateForm();
  }
  
  function clearCandidateForm(){
    let nominationForm = getNominationForm();
    nominationForm.candidate.value = '';
  }
  
  function refreshCandidates(){
    let candidateButtons = document.querySelector("#candidate-buttons");
    candidateButtons.innerHTML = '';
    state.candidates.forEach(candidate=>candidateButtons.append(candidateButton(candidate)));
    updateCandidatesCount();
  }
  
  function refreshCandidatesTally(candidateResults){
    let results = document.querySelector("#results");
    results.innerHTML = '';
    (candidateResults||[]).forEach(candidate=>results.append(candidateTally(candidate)));
  }
  
  function candidateTally(result){
    let item = document.createElement("div");
    item.classList.add("level-item", "has-text-centered", "tally-result");
    
    let div = document.createElement("div");
    let candidateName = document.createElement("p");
    candidateName.classList.add("heading");
    candidateName.append( document.createTextNode(result.name));
    div.append(candidateName);
    
    let candidateResult = document.createElement("p");
    candidateResult.classList.add("title");
    candidateResult.append( document.createTextNode(result.count));
    div.append(candidateResult);
    item.append(div);
    item.dataset.candidate=result.name;
    return item;
  }
  
  function candidateButton(candidate){
    let button = document.createElement("button");
    button.classList.add("button");
    button.type = "button";
    button.dataset.candidate = candidate;
    button.addEventListener("click", (evt)=>vote(button));
    button.append( document.createTextNode(candidate) );
    return button;
  }
  
  function vote(button){
    if( !state.votingStarted ) return;
    if( state.votingClosed ) return;
    if(button){
      if(button.dataset.candidate){
        state.votes.push(button.dataset.candidate);
        updateVotesCount();
      }
    }
  }
  
  function updateCandidatesCount(){
    document.querySelector(".candidate-count").innerHTML = state.candidates.length;
  }
  
  function updateVotesCount(){
    let voteCounter = document.querySelector(".vote-count").innerHTML = state.votes.length;
  }
  
  function updateNominationState(){
    document.querySelector("#nomination-closed").checked = state.votingStarted;
  }
  
  function start(target){
    state.votingStarted = true;
    updateNominationState();
  }
  
  function tally(){
    let candidateTally = (state.votes||[]).reduce( (tally,vote)=>{
      let count = tally[vote]||0;
      count++;
      tally[vote] = count;
      return tally;
    }, {});
    let candidateResults = Object.keys(candidateTally).map(name=>Object.assign({},  {name:name}, {count:candidateTally[name]}));
    refreshCandidatesTally(candidateResults);
    return candidateResults;
  }
  
  function recount(){
    let candidateResults = tally();
    
    let tabulated = (candidateResults||[]).reduce( 
      (tab,result)=>{
        let candidates = (tab[result.count]||[]);
        candidates.push(result.name);
        tab[result.count]=candidates;
        return tab;    
    }, {});
    
    let winningCount = Object.keys(tabulated).map(key=>parseInt(key)||0).sort();
    
    let winnerCount = winningCount[winningCount.length-1]; 
    console.log( winnerCount );
    console.log(tabulated);
    let winningCandidates = tabulated[winnerCount].sort();
    
    let winner = winningCandidates[winningCandidates.length-1];
    
    let winningResult = document.querySelector(`.tally-result[data-candidate=${winner}]`);
    console.log(winningResult);
    winningResult.classList.add("winner");
    refresh();
  }
  
  function closeVoting(){
    state.votingClosed = true;
  }
  
  function reset(element){
    state = {
      candidates : [],
      votes : [],
      votingStarted : false,
      votingClosed : false
    };
    refresh();
  }
  
  function refresh(){
    clearCandidateForm();
    refreshCandidates();
    refreshCandidatesTally();
    updateVotesCount();
    updateNominationState();
  }