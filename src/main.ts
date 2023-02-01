import "./style.css";

class Weither {
  btn: HTMLButtonElement;
  coordinates: HTMLSpanElement;

  constructor() {
    this.btn = <HTMLButtonElement>document.getElementById("btn");
    this.coordinates = <HTMLSpanElement>document.querySelector(".coordinates");
    this.events();
  }
  events() {
    this.getUserCordinates();
  }

  getUserCordinates = () => {
    const cordinates: PositionCallback = (position) => {
      const { longitude, latitude } = position.coords;

      this.updateUICordinate(latitude, longitude);
    };

    const errorCallback: PositionErrorCallback = (errorMsg) => errorMsg.message;

    const getLocation = () =>
      navigator.geolocation.getCurrentPosition(cordinates, errorCallback);
    this.btn.addEventListener("click", getLocation);
  };

  updateUICordinate = (latitude: number, longitude: number) => {
    this.coordinates.innerHTML = `${latitude} <br> ${longitude}`;
  };
}

new Weither();
