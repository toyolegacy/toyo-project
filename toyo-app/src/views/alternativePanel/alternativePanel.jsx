import React, { useRef, useEffect, useCallback, useState } from "react";

import { getAccessToken } from "../../domain/auth/services/getAccessToken";
import { useWindowSize } from "../../domain/global/hooks/useWindowSize";
import { getProfile } from "../../domain/player/services/getProfile";
import { findPlayerById } from "../../domain/player/services/findPlayerById";
import { savePlayer } from "../../domain/player/services/savePlayer";
import { getWallets } from "../../domain/wallet/services/getWallets";
import { manageWallets } from "../../domain/wallet/services/manageWallets";
import { transferToken } from "../../domain/token/services/transferToken";
import { getNfts } from "../../domain/token/services/getNftByAddress";
import { updatePlayer } from "../../domain/player/services/updatePlayer";
import { sleep } from "../../domain/global/hooks/sleep";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles.css";

export function AlternativePanel(props) {
  const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
  const reRef = useRef();

  // let [width, height] = useWindowSize();
  let [player, setPlayer] = useState({});
  let [auth, isAuth] = useState(false);
  let [loading, isLoading] = useState(false);
  let [verified, isVerified] = useState(false);
  let [disable, isDisabled] = useState(true);
  let [count, setCount] = useState(0);

  const notify = (type) => {
    switch (type) {
      case "welcome":
        toast("🦄 Welcome WH9 human", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      case "sucess":
        toast.success("🦄 Plim! And it's done ✨");
        break;
      case "error":
        toast.error("🦄 Sorry, something went wrong...");
        break;
      case "info":
        toast.info("🦄 You got new console logs ");
        break;
      case "warn":
        toast.warn("🦄 Hey! That's not how it's done!");
        break;
      default:
        toast("🦄 Welcome WH9 human", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
    }
  };

  const onChange = async (token) => {
    const url =
      `${process.env.REACT_APP_BASE_STAGING_URL}/auth/recaptcha/` + token;
    // console.log("Captcha token:", token);
    // console.log(url);
    await axios
      .post(url)
      .then((response) => {
        console.log("👷 Oh thanks lord! you are a WH9 human!", response.data);
        isVerified(true);
        isDisabled(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNfts = async (arkaneConnect, address) => {
    isLoading(true);

    if (player.wallet === undefined) {
      notify("error");
      console.group("👷 Please register a wallet before mint");
      isLoading(false);
      return;
    }

    const nfts = await getNfts(arkaneConnect, address);

    if (nfts) {
      notify("sucess");
    } else {
      notify("error");
    }

    isLoading(false);
  };

  const handleTransfer = async (arkaneConnect, typeId, quantity, value) => {
    if (quantity === 0) {
      notify("warn");
      console.group("👷 Sorry, we do magic but miracle is another thing...");
      return;
    }

    if (disable) {
      notify("error");
      console.group("👷 Please do the CAPTCHA before mint");
      return;
    }

    if (player.wallet === undefined) {
      notify("error");
      console.log("👷 Your wallet is empty...", player.wallet);
      console.group("👷 Please register a wallet before mint");
      isLoading(false);
      return;
    }

    isLoading(true);

    const serverResponding = await getAccessToken();

    if (!serverResponding) {
      notify("error");
      isLoading(false);
      return;
    }

    const walletId = player.wallet.id;
    const adminAddress = "0xaC17244Cd4F718A7a9a2c4dfF2f9C7775934824D";
    // const tokenAddress = "0xbeB2d63b25002b8959945B0a01aF0D64bf1ddED1";
    const secretType = "MATIC";
    const totalValue = value * quantity;

    const transactionRequest = {
      walletId,
      to: adminAddress,
      value: totalValue,
      secretType,
    };

    const mintRequest = {
      address: player.wallet.address,
      typeId,
      quantity,
    };

    const signerResult = await transferToken(
      arkaneConnect,
      transactionRequest,
      mintRequest
    );

    if (signerResult) {
      notify("sucess");
    } else {
      notify("error");
    }

    isLoading(false);
  };

  const handlePlayerWallet = async (arkaneConnect) => {
    // console.log("player na wallet: ", player);

    let wallets = await getWallets(props.arkaneConnect);
    console.log(`👷 your wallets: `, wallets);
    notify("info");

    if (wallets.length !== 0) {
      // console.log("👷 Setting up your wallet...");
      setPlayer((prevState) => ({ ...prevState, wallet: wallets[0] }));
      notify("info");
    } else {
      console.log(
        "👷 So you don't own one... No worries, I'm already preparing a new wallet for you"
      );
      await manageWallets(props.arkaneConnect);

      wallets = await getWallets(props.arkaneConnect);
      setPlayer((prevState) => ({ ...prevState, wallet: wallets[0] }));
      notify("info");
    }

    /* const updatePlayerWalletDto = {
      wallets: wallets[0].address,
    }; */

    // console.log(player);
    // console.log(player.playerId, updatePlayerWalletDto);
    // await updatePlayer(player, updatePlayerWalletDto);
  };

  const handleAuthPlayer = async (arkaneConnect) => {
    isLoading(true);
    const profile = await getProfile(props.arkaneConnect);

    if (profile) {
      const playerId = profile.userId;
      const firstName = profile.firstName;
      const lastName = profile.lastName;
      const email = profile.email;

      const existingPlayer = await findPlayerById(playerId);

      if (existingPlayer) {
        await setPlayer({
          playerId: existingPlayer.playerId,
          firstName: existingPlayer.firstName,
          lastName: existingPlayer.lastName,
          email: existingPlayer.email,
        });
        notify("info");
        // await sleep(1000);
        // console.log("player: ", player);
      } else {
        console.log("👷 Don't worry, we'll set you up on the action 😉!");

        const newPlayer = {
          playerId: playerId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          wallets: null,
        };

        setPlayer({
          playerId: playerId,
          firstName: firstName,
          lastName: lastName,
          email: email,
        });
        notify("info");

        // console.log("player: ", player);

        await savePlayer(newPlayer);
      }
    }

    await handlePlayerWallet(props.arkaneConnect);

    isLoading(false);
  };

  const authPlayer = async (arkaneConnect) => {
    return await arkaneConnect.flows
      .authenticate({ windowMode: "POPUP" })
      .then((result) => {
        result.authenticated((auth) => {
          console.log(`👷 User authenticated: ${auth.authenticated}`);
          notify("sucess");
          handleAuthPlayer();
          isAuth(true);
        });

        result.notAuthenticated((auth) => {
          console.log("👷 User couldn't be authenticated");
        });
      });
  };

  const handleInit = async () => {
    notify("welcome");
    console.log(`👷 Welcome to Toyo's official webpage!`);

    if (props.arkaneConnect !== undefined) {
      console.log(`👷 Device online and ready to go!`);
    }
  };

  useEffect(() => {
    console.log("👷 player info: ", player);
  }, [player]);

  /* useEffect(() => {
    console.log(verified);
  }, [verified]); */

  /* useEffect(() => {
    console.log(count);
  }, [count]); */

  useEffect(() => {
    handleInit();
  }, []);

  return (
    <div id="body">
      <ToastContainer />
      <section>
        <div id="top" className="canvas">
          <div>PRESS F12 AND GO FOR "CONSOLE" FOR BETTER UX</div>
          <div id="user-auth">
            <button
              type="action"
              onClick={() => authPlayer(props.arkaneConnect)}
              disabled={loading}
            >
              CONNECT ACCOUNT
            </button>
          </div>
        </div>
        <div id="middle" className="canvas">
          <div id="transaction">
            <div id="transaction-buy-token" className="btn">
              <button
                type="action"
                onClick={() =>
                  handleTransfer(props.arkaneConnect, 1, count, 0.001)
                }
                disabled={loading}
              >
                BUY KYTUNT CHEST
              </button>
            </div>
            <div id="transaction-buy-token-counter" className="counter">
              <button onClick={() => setCount(count - 1)}>-</button>
              <div>{count}</div>
              <button onClick={() => setCount(count + 1)}>+</button>
            </div>
            <ReCAPTCHA
              sitekey={RECAPTCHA_KEY}
              ref={reRef}
              onChange={onChange}
            />
          </div>
          <div id="user-nft">
            <button
              type="action"
              onClick={() =>
                handleNfts(props.arkaneConnect, player.wallet.address)
              }
              disabled={loading}
            >
              GET NFTS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
