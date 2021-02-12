import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import db from "../api/firebase";
import { selectUser } from "../features/userSlice";
import "../css/plans.css";

function Plans() {
  const [products, setProducts] = useState();
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start: subscription.data().current_period_start
              .seconds,
          });
        });
      });
  }, [user.uid]);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(`An error occured: ${error.message}`);
      }

      if (sessionId) {
        const stripe = await loadStripe(
          "sk_test_51IG1cIFrB6Yexwqm23vsRytfIMRUGgKBG4qrjIjjvjnvmZEMqXoSGgZ4aDrWjmAZ4Sq8tU1HbPRcptWm2yy0a6ag00HlcjdNlN"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  console.log(products);

  return (
    <div className="plans">
      {products !== undefined &&
        Object.entries(products).map(([productId, productData]) => {
          {
            /* const isCurrentPackage = productData.name
            ?.toLowerCase()
            .includes(subscription.role); */
          }
          const isCurrentPackage = null;
          return (
            <div
              key={productId}
              className={` ${isCurrentPackage && "plan__disabled"} plans__item`}
            >
              <div className="plan__info">
                <h5>{productData.name}</h5>
                <h6>{productData.description}</h6>
              </div>
              <button
                onClick={() =>
                  !isCurrentPackage && loadCheckout(productData.prices.priceId)
                }
              >
                {isCurrentPackage ? "Current Package" : "Subscribe"}
              </button>
            </div>
          );
        })}
    </div>
  );
}

export default Plans;
