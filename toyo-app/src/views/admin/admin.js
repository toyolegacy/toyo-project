import DOMPurify from "dompurify";

const myHTML = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Toyo Token Crowdsale</title>

  <link rel="stylesheet" href="css/style.css">
  <script type="text/javascript">
    var verifyCallback = function (response) {
      App.captchaResponse = response;
      App.enableBuyButtons();
    };

    var onloadCallback = function () {
      App.captchaWidget = grecaptcha.render('captchaWidget', {
        'sitekey': '6Ldp1qscAAAAAHj1ID6fC4x8N8QN4l8N1R71Nhq2',
        'callback': verifyCallback,
      });
    };
  </script>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
</head>

<body>
  <div class="container" style="width: 750px;">
    <div class="row">
      <div class="col-lg-12">
        <h1 class="text-center">NFT TOYO CROWDSALE</h1>
      </div>
      <p></p> 

      <div id="loader">
        <p class="text-center">Loading...</p>
      </div>

      <div id="dangerAlert" class="alert alert-danger" role="alert" style="display:none;"></div>
      <div id="successAlert" class="alert alert-success" role="alert" style="display:none;"></div>

      <p id="MetaMaskButtons">

        <button id="connectButton" onClick="MetaMask.connectWallet()" class="btn btn-secondary btn-lg"
          style="width:345px;margin-right:10px;">
          <img src="images/metamask.png" height="30px" />
          Connect to MetaMask
        </button>

        <button id="connectedButton" class="btn btn-success btn-lg" style="display:none;width:345px;margin-right:10px;">
          <img src="images/metamask.png" height="30px" />
          Connected wallet
        </button>

        <button id="connectButton" onClick="MetaMask.switchNetwork()" class="btn btn-outline-secondary btn-lg"
          style="margin-right:10px">
          <img src="images/polygon.png" height="30px" />
          Add Polygon
        </button>

        <button id="addToWalletButton" onClick="MetaMask.addToWallet()" class="btn btn-outline-secondary btn-lg">
          <img src="https://ipfs.io/ipfs/QmbCZgCm5KkP7KSWLfR67nd4NR1Kt56j6f85ZcGZ4Ur7vS" height="30px" />
          Add TOYF9
        </button>

      </p>

      <div id="content" class="text-center" style="display: none;">

        <p class="account"><span class="box">Your wallet <span class="wallet-address"></span></span></p>

        <p class="nft-token">Toyo address <a href="#" target="_blank">
            <span class="wallet-address"></span></a>
        </p>

        <!-- <p class="nft-factory">Factory address <a href="#" target="_blank">
          <span class="wallet-address"></span></a>
        </p> -->
        
        <p>You currently have <span class="dapp-balance"></span></a>&nbsp;Toyos</p>

        <div class="row row-cols-1 row-cols-md-2 mb-3 text-center">
          <div class="col">
            <div class="card mb-4 rounded-3 shadow-sm border-primary">
              <div class="card-header py-3 text-white bg-primary border-primary">
                <h4 class="my-0 fw-normal">Kytunt Seed Box</h4>
              </div>

              <!-- token type div -->
              <div class="card-body" data-token-type="1">
                <h1 class="card-title pricing-card-title">
                  <input type="number" min="1" class="form-control quantity" placeholder="1">

                  <span class="price-container">
                    <span class="price-matic-container">
                      <span class="price-matic">-</span>
                      <small class="text-muted fw-light">/matic+gas</small>
                    </span>
                    <span class="price-usd-container">
                      <small class="text-muted fw-light">~</small>
                      <span class="price-dolar">-</span>
                      <small class="text-muted fw-light"> usd</small>
                    </span>
                  </span>

                </h1>
                <ul class="list-unstyled mt-3 mb-4">
                  <li>Toyo - Kytunt Seed Box</li>
                  <li><span class="purchase-cap">-</span> limit per transaction</li>
                  <li><span class="total-supply">-</span> minted / <span class="max-supply">-</span> max supply</li>
                </ul>
                <button type="submit" id="token1-buy" disabled onclick="App.buyTokens(App.tokenTypesForSale[0])"
                  class="w-100 btn btn-lg btn-primary buy">Buy</button>
              </div>
              <!-- token type div -->

            </div>
          </div>

          <div class="col">
            <div class="card mb-4 rounded-3 shadow-sm border-primary">
              <div class="card-header py-3 text-white bg-primary border-primary">
                <h4 class="my-0 fw-normal">Fortified Kytunt Seed Box</h4>
              </div>

              <!-- token type div -->
              <div class="card-body" data-token-type="2">
                <h1 class="card-title pricing-card-title">
                  <input type="number" min="1" class="form-control quantity" placeholder="1">

                  <span class="price-container">
                    <span class="price-matic-container">
                      <span class="price-matic">-</span>
                      <small class="text-muted fw-light">/matic+gas</small>
                    </span>
                    <span class="price-usd-container">
                      <small class="text-muted fw-light">~</small>
                      <span class="price-dolar">-</span>
                      <small class="text-muted fw-light"> usd</small>
                    </span>
                  </span>
                </h1>

                <ul class="list-unstyled mt-3 mb-4">
                  <li>Toyo - Fortified Kytunt Seed Box</li>
                  <li><span class="purchase-cap">-</span> limit per transaction</li>
                  <li><span class="total-supply">-</span> minted / <span class="max-supply">-</span> max supply</li>
                </ul>
                
                <button type="submit" disabled onclick="App.buyTokens(App.tokenTypesForSale[1])"
                  class="w-100 btn btn-lg btn-primary buy">Buy</button>
              </div>
              <!-- token type div -->

            </div>
          </div>
        </div>
        
        <div id="captchaWidget" style="display: flex; justify-content: center;"></div>

        <div class="countdownWidget" style="display: none; justify-content: center;">
          Try again in <span class="countdownTimer">-</span> seconds
        </div>

        <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer>
        </script>

      </div>

    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/web3@1.6.0/dist/web3.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@truffle/contract@4.3.37/dist/truffle-contract.min.js"></script>

  <script src="js/app.js"></script>

</body>

</html>`;

const mySafeHTML = DOMPurify.sanitize(myHTML);

const Admin = () => <div dangerouslySetInnerHTML={{ __html: mySafeHTML }} />;

export { Admin };