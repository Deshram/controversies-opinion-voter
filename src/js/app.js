App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },
  
  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
  
    loader.show();
    content.hide();
  
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  
    // Load contract data
    App.contracts.Election.deployed().then(async function(instance) {
      electionInstance = instance;
      return await electionInstance.propagandaCount();
    }).then(async function(propagandaCount) {
      for(var i = 1; i<=3; i++){

        var propResults = $('.table')[i-1]
        console.log(i-1)
        await electionInstance.seeVotes(i,1)
        .then(function(votecount){
          propResults.rows.item(1).insertCell(1).innerHTML = "";
          propResults.rows.item(1).insertCell(1).innerHTML = votecount;
        });
        await electionInstance.seeVotes(i,2)
        .then(function(votecount){
          propResults.rows.item(2).insertCell(1).innerHTML = "";
          propResults.rows.item(2).insertCell(1).innerHTML = votecount;
        });
        

        await electionInstance.ifVoted(App.account, i).then(function(voted){
          console.log(voted);
          if(voted){
            console.log(voted);
            $('form')[i-1].style.display = 'none'
          }
      })
      }
      
      loader.hide();
      content.show();
  
    }).catch(function(error) {
      console.warn(error);
    });
  },
  
  castVote: function(i) {
    var optionId = Number($('.optionSelect')[i].value);
    App.contracts.Election.deployed().then(async function(instance) {
      return await instance.vote(i+1, optionId, { from: App.account });
    }).then(async function(result) {
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
      await location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});