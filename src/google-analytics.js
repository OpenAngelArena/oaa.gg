import { useEffect } from "react";
import ga from "react-ga";
import { useLocation } from "react-router-dom";

let currentTrackingID = null;

export const trackingID = 'UA-112154059-2';

export function useGoogleAnalytics(tid = trackingID) {
  if (tid !== currentTrackingID) {
    currentTrackingID = tid;
    ga.initialize(tid);
  }
}

export function usePageViews() {
  let location = useLocation();
  useEffect(() => {
    ga.send(["pageview", location.pathname]);
  }, [location]);
}

export function Analytics(props) {
  useGoogleAnalytics();
  usePageViews();
  return props.children || null;
}
