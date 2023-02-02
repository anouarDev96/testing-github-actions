import "./style.css";
import file from "../secret.json";
import OpenWeatherMap from "openweathermap-ts";

export type WeitherData = {
  main: string;
  description: string;
  icon: string;
  country: string;
  temp: number;
};

class Weither {
  app: HTMLDivElement;
  coordinates: HTMLSpanElement;
  openWeather: OpenWeatherMap;
  isLoading: Boolean = false;

  constructor() {
    this.app = <HTMLDivElement>document.querySelector("#app");
    this.coordinates = <HTMLSpanElement>document.querySelector(".coordinates");
    this.openWeather = new OpenWeatherMap({
      apiKey: file.token,
    });

    this.events();
  }
  events() {
    this.getUserCordinates();
  }

  getUserCordinates = () => {
    const cordinates: PositionCallback = async (position) => {
      const { longitude, latitude } = position.coords;

      this.handleLoading();

      this.loadingUI();

      const data = await this.fetchUserweither(longitude, latitude);

      this.isLoading = false;

      this.updateUI(data!);
    };

    const errorCallback: PositionErrorCallback = (errorMsg) => errorMsg.message;

    const getLocation = () =>
      navigator.geolocation.getCurrentPosition(cordinates, errorCallback);
    document.addEventListener("DOMContentLoaded", getLocation);
  };

  updateUI = ({ icon, country, description, main, temp }: WeitherData) => {
    document.body.innerHTML = `<section class="container">
        <div class="icon">
          <img
            src="http://openweathermap.org/img/wn/${icon}@2x.png"
            class="icon__img"
            alt="weither icon"
            width="200px"
            height="250px"
          />
        </div>
        <div class="description">
          <span class="description__value">${main}<br>${description}</span>
        </div>
        <div class="tempature">
          <span>Tempature</span>
          <div class="Tempature__value">${temp}°C</div>
        </div>

        <div class="location">
          <span>Location</span>
          <div class="location__value">${country}</div>
        </div>
       
      </section>`;
  };

  fetchUserweither = async (longitude: number, latitude: number) => {
    this.openWeather.setUnits("metric");

    this.handleLoading();

    try {
      const data = await this.openWeather.getCurrentWeatherByGeoCoordinates(
        latitude,
        longitude
      );

      const { weather, sys } = data!;
      const { main, description, icon } = weather[0];
      const { country } = sys;
      const { temp } = data!.main;

      this.handleLoading();

      return { main, description, icon, country, temp };
    } catch (error) {
      return this.handleError(error as Error);
    }
  };
  handleError = (error: Error) => {
    this.app.innerHTML = `<p class="errorMessage">${error.message}</p>`;
  };
  handleLoading = () => (this.isLoading = !this.isLoading);

  loadingUI = () => {
    if (this.isLoading) {
      const el = document.createElement("div");

      el.classList.add("loading");

      el.innerText = `loading ...`;

      this.app.append(el);
    } else {
      document.querySelector(".loading")?.remove();
    }
  };
}

new Weither();
