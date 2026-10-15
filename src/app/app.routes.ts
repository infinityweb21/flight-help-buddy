import { Routes } from "@angular/router";
import { BlankLayoutComponent } from "./layout/blank-layout/blank-layout.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { blogDetailsResolver } from "./resolvers/blog-details.resolver";
import { cruiseDetailsResolver } from "./resolvers/cruise-details.resolver";
import { cruiseLinesResolver } from "./resolvers/cruise-lines.resolver";
import { blogResolver } from "./resolvers/blog.resolver";
import { topRoutesResolver } from "./resolvers/top-routes.resolver";
import { topRoutesDetailsResolver } from "./resolvers/top-routes-details.resolver";
import { dealsResolver } from "./resolvers/deals.resolver";
import { dealResolver } from "./resolvers/deal.resolver";
import { topDestinationResolver } from "./resolvers/top-destination.resolver";
import { topDestinationDetailsResolver } from "./resolvers/top-destination-details.resolver";
import { DestinationsResolver } from "./resolvers/destinations.resolver";

export const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/home/home.component").then((m) => m.HomeComponent),
        title: "Book Your Next Trip Online | Flighthelpbuddy",
        data: {
          metaTitle: "Book Your Next Trip Online | Flighthelpbuddy",
          metaDescription:
            "Find affordable flights, hotel deals, car rentals, and cruises for your next journey. Compare your options and book with a simple online experience.",
        },
      },
      {
        path: "flight",
        loadComponent: () =>
          import("./pages/flight/flight.component").then(
            (m) => m.FlightComponent,
          ),
        title: "Book Cheap Flights Online | Flighthelpbuddy",
        data: {
          metaTitle: "Book Cheap Flights Online | Flighthelpbuddy",
          metaDescription:
            "Find and compare cheap flights from hundreds of airlines. Explore affordable airfare and book domestic or international flights with ease.",
        },
      },

      {
        path: "routes",
        loadComponent: () =>
          import("./pages/routes/routes.component").then(
            (m) => m.RoutesComponent,
          ),
        title: "Explore International & Domestic Flight Routes | Flighthelpbuddy",
        data: {
          metaTitle:
            "Explore International & Domestic Flight Routes | Flighthelpbuddy",
          metaDescription:
            "Explore international and domestic flight routes with Flighthelpbuddy. Compare available flights, find convenient routes, and book your next trip with ease.",
        },
      },
      {
        path: "flight-info",
        loadComponent: () =>
          import("./pages/flight/flight-details/flight-details.component").then(
            (m) => m.FlightDetailsComponent,
          ),
        title: " Buy Cheap Airline Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Buy Cheap Airline Tickets | Flighthelpbuddy",
          metaDescription:
            "Buy cheap airline tickets for one-way or round-trip flights with Flighthelpbuddy. Call 1 (800) 645-3851 for the best deals on domestic and international fares.",
        },
      },
      {
        path: "flights/international-flights-from-us",
        loadComponent: () =>
          import("./pages/flight/international/international.component").then(
            (m) => m.InternationalComponent,
          ),
        title: "Cheap International Flights Tickets| Flighthelpbuddy",
        data: {
          metaTitle: "Cheap International Flights Tickets| Flighthelpbuddy",
          metaDescription:
            "Find cheap international flights with Flighthelpbuddy. Get the best fares worldwide—call 1 (800) 645-3851 now for deals and 24/7 booking support!",
        },
      },
      {
        path: "flights/international-flights-to-us",
        loadComponent: () =>
          import("./pages/flight/international-to-us/international-to-us.component").then(
            (m) => m.InternationalToUsComponent,
          ),
        title: "Cheap International Flights Tickets| Flighthelpbuddy",
        data: {
          metaTitle: "Cheap International Flights Tickets| Flighthelpbuddy",
          metaDescription:
            "Find cheap international flights with Flighthelpbuddy. Get the best fares worldwide—call 1 (800) 645-3851 now for deals and 24/7 booking support!",
        },
      },
      {
        path: "first-class-flight-tickets",
        loadComponent: () =>
          import("./pages/flight/first-class/first-class.component").then(
            (m) => m.FirstClassComponent,
          ),
        title: "Book Cheap First Class Tickets & Deals | Flighthelpbuddy",
        data: {
          metaTitle: "Book Cheap First Class Tickets & Deals | Flighthelpbuddy",
          metaDescription:
            "Book cheap first class tickets with Flighthelpbuddy and fly in luxury for less. Enjoy VIP service, spacious seats, and exclusive deals worldwide.",
        },
      },
      {
        path: "business-class-flight-tickets",
        loadComponent: () =>
          import("./pages/flight/business-class/business-class.component").then(
            (m) => m.BusinessClassComponent,
          ),
        title: "Business Class Flights – Affordable Luxury & Exclusive Deals ",
        data: {
          metaTitle:
            "Business Class Flights – Affordable Luxury & Exclusive Deals ",
          metaDescription:
            "Get the cheapest business class deals now with Flighthelpbuddy! Experience luxury, savings & exclusive offers on top international routes.",
        },
      },
      {
        path: "business-class",
        loadComponent: () =>
          import("./pages/business-class/business-class.component").then(
            (m) => m.BusinessClassComponent,
          ),
        title: "Book Business Class Tickets at Great Fares | Flighthelpbuddy",
        data: {
          metaTitle:
            "Book Business Class Tickets at Great Fares | Flighthelpbuddy",
          metaDescription:
            "Looking for affordable Business Class tickets? Explore flight options, compare fares, and enjoy a more comfortable way to travel.",
        },
      },
      {
        path: "flights-list",
        loadComponent: () =>
          import("./pages/flights-list/flights-list.component").then(
            (m) => m.FlightsListComponent,
          ),
        title: " Buy Cheap Airline Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Buy Cheap Airline Tickets | Flighthelpbuddy",
          metaDescription:
            "Buy cheap airline tickets for one-way or round-trip flights with Flighthelpbuddy. Call 1 (800) 645-3851 for the best deals on domestic and international fares.",
        },
      },
      {
        path: "flight-details",
        loadComponent: () =>
          import("./pages/flights-list/flight-details/flight-details.component").then(
            (m) => m.FlightDetailsComponent,
          ),
        title: " Buy Cheap Airline Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Buy Cheap Airline Tickets | Flighthelpbuddy",
          metaDescription:
            "Buy cheap airline tickets for one-way or round-trip flights with Flighthelpbuddy. Call 1 (800) 645-3851 for the best deals on domestic and international fares.",
        },
      },

      {
        path: "flight/booking",
        loadComponent: () =>
          import("./pages/flights-list/flight-details/flight-payment/flight-payment.component").then(
            (m) => m.FlightPaymentComponent,
          ),
        title: " Buy Cheap Airline Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Buy Cheap Airline Tickets | Flighthelpbuddy",
          metaDescription:
            "Buy cheap airline tickets for one-way or round-trip flights with Flighthelpbuddy. Call 1 (800) 645-3851 for the best deals on domestic and international fares.",
        },
      },
      {
        path: "package-review-and-payment",
        loadComponent: () =>
          import("./pages/packages/review-and-payment/review-and-payment.component").then(
            (m) => m.ReviewAndPaymentComponent,
          ),
        title: " Buy Cheap Airline Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Buy Cheap Airline Tickets | Flighthelpbuddy",
          metaDescription:
            "Buy cheap airline tickets for one-way or round-trip flights with Flighthelpbuddy. Call 1 (800) 645-3851 for the best deals on domestic and international fares.",
        },
      },
      {
        path: "flight-booking-confirmation",
        loadComponent: () =>
          import("./pages/flights-list/flight-details/flight-payment/flight-download-ticket/flight-download-ticket.component").then(
            (m) => m.FlightDownloadTicketComponent,
          ),
        title: " Buy Cheap Airline Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Buy Cheap Airline Tickets | Flighthelpbuddy",
          metaDescription:
            "Buy cheap airline tickets for one-way or round-trip flights with Flighthelpbuddy. Call 1 (800) 645-3851 for the best deals on domestic and international fares.",
        },
      },
      {
        path: "hotel",
        loadComponent: () =>
          import("./pages/hotel/hotel.component").then((m) => m.HotelComponent),
        title: "Book Hotels Online at Great Prices | Flighthelpbuddy",

        data: {
          metaTitle: "Book Hotels Online at Great Prices | Flighthelpbuddy",
          metaDescription:
            "Find and book hotels worldwide at great prices. Compare stays, explore rooms, and choose the perfect hotel for your next trip.",
        },
      },
      {
        path: "hotels-list",
        loadComponent: () =>
          import("./pages/hotels-list/hotels-list.component").then(
            (m) => m.HotelsListComponent,
          ),
        title:
          "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations",
        data: {
          metaTitle:
            "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations ",
          metaDescription:
            "Get massive discounts on hotel reservations with Flighthelpbuddy. Book hotel rooms online and with cheap hotel booking deals escape into the unknown with your loved ones.",
        },
      },
      {
        path: "hotel-details",
        loadComponent: () =>
          import("./pages/hotels-list/hotel-details/hotel-details.component").then(
            (m) => m.HotelDetailsComponent,
          ),
        title:
          "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations",
        data: {
          metaTitle:
            "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations ",
          metaDescription:
            "Get massive discounts on hotel reservations with Flighthelpbuddy. Book hotel rooms online and with cheap hotel booking deals escape into the unknown with your loved ones.",
        },
      },
      {
        path: "hotel-booking",
        loadComponent: () =>
          import("./pages/hotels-list/hotel-details/hotel-booking-payment/hotel-booking-payment.component").then(
            (m) => m.HotelBookingPaymentComponent,
          ),
        title:
          "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations",
        data: {
          metaTitle:
            "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations ",
          metaDescription:
            "Get massive discounts on hotel reservations with Flighthelpbuddy. Book hotel rooms online and with cheap hotel booking deals escape into the unknown with your loved ones.",
        },
      },
      {
        path: "hotel-booking-ticket",
        loadComponent: () =>
          import("./pages/hotels-list/hotel-details/hotel-booking-ticket/hotel-booking-ticket.component").then(
            (m) => m.HotelBookingTicketComponent,
          ),
        title:
          "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations",
        data: {
          metaTitle:
            "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations ",
          metaDescription:
            "Get massive discounts on hotel reservations with Flighthelpbuddy. Book hotel rooms online and with cheap hotel booking deals escape into the unknown with your loved ones.",
        },
      },
      {
        path: "package-hotels-list",
        loadComponent: () =>
          import("./pages/hotels-list/hotels-list.component").then(
            (m) => m.HotelsListComponent,
          ),
        title:
          "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations",
        data: {
          metaTitle:
            "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations ",
          metaDescription:
            "Get massive discounts on hotel reservations with Flighthelpbuddy. Book hotel rooms online and with cheap hotel booking deals escape into the unknown with your loved ones.",
        },
      },
      {
        path: "package-hotel-details",
        loadComponent: () =>
          import("./pages/hotels-list/hotel-details/hotel-details.component").then(
            (m) => m.HotelDetailsComponent,
          ),
        title:
          "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations",
        data: {
          metaTitle:
            "Cheap Hotel Deals | Book Best Hotel Online | Discounts on Hotel Reservations ",
          metaDescription:
            "Get massive discounts on hotel reservations with Flighthelpbuddy. Book hotel rooms online and with cheap hotel booking deals escape into the unknown with your loved ones.",
        },
      },
      {
        path: "package-flights-list",
        loadComponent: () =>
          import("./pages/flights-list/flights-list.component").then(
            (m) => m.FlightsListComponent,
          ),
        title: " Buy Cheap Airline Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Buy Cheap Airline Tickets | Flighthelpbuddy",
          metaDescription:
            "Buy cheap airline tickets for one-way or round-trip flights with Flighthelpbuddy. Call 1 (800) 645-3851 for the best deals on domestic and international fares.",
        },
      },
      {
        path: "cruise",
        loadComponent: () =>
          import("./pages/cruise/cruise.component").then(
            (m) => m.CruiseComponent,
          ),
        title: "Book Cruise Holidays & Get Best Cruise Deals | Flighthelpbuddy",
        data: {
          metaTitle:
            "Book Cruise Holidays & Get Best Cruise Deals | Flighthelpbuddy",
          metaDescription:
            "Discover the ocean with flexible ticket options, transparent pricing, and 24/7 support. Earn ClubMiles rewards and book your cruise adventure today!",
        },
      },
      {
        path: "cruises-list",
        loadComponent: () =>
          import("./pages/cruises-list/cruises-list.component").then(
            (m) => m.CruisesListComponent,
          ),
        title: "Luxury Cruise Deals from Top Cruise Lines | Flighthelpbuddy",
        data: {
          metaTitle: "Luxury Cruise Deals from Top Cruise Lines | Flighthelpbuddy",
          metaDescription:
            "Find the best luxury cruise deals with Flighthelpbuddy and save big on top cruise lines. Call (888) 975-1707 now to book your premium cruise vacation.",
        },
      },
      {
        path: "cruise-details",
        loadComponent: () =>
          import("./pages/cruises-list/cruise-details/cruise-details.component").then(
            (m) => m.CruiseDetailsComponent,
          ),
        title: "Luxury Cruise Deals from Top Cruise Lines | Flighthelpbuddy",
        data: {
          metaTitle: "Luxury Cruise Deals from Top Cruise Lines | Flighthelpbuddy",
          metaDescription:
            "Find the best luxury cruise deals with Flighthelpbuddy and save big on top cruise lines. Call (888) 975-1707 now to book your premium cruise vacation.",
        },
      },
      {
        path: "cruise-booking",
        loadComponent: () =>
          import("./pages/cruises-list/cruise-details/cruise-booking-payment/cruise-booking-payment.component").then(
            (m) => m.CruiseBookingPaymentComponent,
          ),
        title: "Luxury Cruise Deals from Top Cruise Lines | Flighthelpbuddy",
        data: {
          metaTitle: "Luxury Cruise Deals from Top Cruise Lines | Flighthelpbuddy",
          metaDescription:
            "Find the best luxury cruise deals with Flighthelpbuddy and save big on top cruise lines. Call (888) 975-1707 now to book your premium cruise vacation.",
        },
      },
      {
        path: "car",
        loadComponent: () =>
          import("./pages/car/car.component").then((m) => m.CarComponent),

        title: "Affordable Car Rentals & Instant Booking | Flighthelpbuddy",

        data: {
          metaTitle: "Affordable Car Rentals & Instant Booking | Flighthelpbuddy",
          metaDescription:
            "Rent the perfect car for your next trip at prices that fit your budget. Enjoy transparent pricing, 24/7 support, and easy pick-up. Book your ride today!",
        },
      },
      {
        path: "car-list",
        loadComponent: () =>
          import("./pages/car-list/car-list.component").then(
            (m) => m.CarListComponent,
          ),
        title: "Car Rental Deals | Book Your Car Online | Flighthelpbuddy",
        data: {
          metaTitle: "Car Rental Deals | Book Your Car Online | Flighthelpbuddy",
          metaDescription:
            "Find the best car rental deals with Flighthelpbuddy and save big on top car rental companies. Call (888) 975-1707 now to book your premium car rental vacation.",
        },
      },
      {
        path: "car-details",
        loadComponent: () =>
          import("./pages/car-list/car-details/car-details.component").then(
            (m) => m.CarDetailsComponent,
          ),
        title: "Car Rental Deals | Book Your Car Online | Flighthelpbuddy",
        data: {
          metaTitle: "Car Rental Deals | Book Your Car Online | Flighthelpbuddy",
          metaDescription:
            "Find the best car rental deals with Flighthelpbuddy and save big on top car rental companies. Call (888) 975-1707 now to book your premium car rental vacation.",
        },
      },
      {
        path: "car-booking",
        loadComponent: () =>
          import("./pages/car-list/car-details/car-booking/car-booking.component").then(
            (m) => m.CarBookingComponent,
          ),
        title: "Car Rental Deals | Book Your Car Online | Flighthelpbuddy",
        data: {
          metaTitle: "Car Rental Deals | Book Your Car Online | Flighthelpbuddy",
          metaDescription:
            "Find the best car rental deals with Flighthelpbuddy and save big on top car rental companies. Call (888) 975-1707 now to book your premium car rental vacation.",
        },
      },
      {
        path: "about",
        loadComponent: () =>
          import("./pages/about-us/about-us.component").then(
            (m) => m.AboutUsComponent,
          ),
        title: "About Flighthelpbuddy | Your Trusted Travel Booking Partner",
        data: {
          metaTitle: "About Flighthelpbuddy | Your Trusted Travel Booking Partner",
          metaDescription:
            "Learn about Flighthelpbuddy, a trusted travel booking assistance platform helping you find great deals on flights, hotels, car rentals, and cruises.",
        },
      },

      {
        path: "blog",
        loadComponent: () =>
          import("./pages/blog/blog.component").then((m) => m.BlogComponent),
        title: "Travel Tips & Inspiration Blog | Flighthelpbuddy",
        data: {
          metaTitle: "Travel Tips & Inspiration Blog | Flighthelpbuddy",
          metaDescription:
            "Get travel inspiration, tips, and the latest news from Flighthelpbuddy’ blog. Your go-to source for all things travel and adventure.",
        },
      },
      {
        path: "blog-details/:id",
        loadComponent: () =>
          import("./pages/blog/blog-details/blog-details.component").then(
            (m) => m.BlogDetailsComponent,
          ),
        resolve: {
          blogData: blogDetailsResolver,
        },
      },
      {
        path: "contact",
        loadComponent: () =>
          import("./pages/contact-us/contact-us.component").then(
            (m) => m.ContactUsComponent,
          ),
        title: "Contact Us | Flighthelpbuddy",
        data: {
          metaTitle: "Contact Us | Flighthelpbuddy",
          metaDescription:
            "Wishing to fly to your dreamland? Reach out to us now. Choose to fly with Flighthelpbuddy. Contact for any booking-related questions or queries right now.",
        },
      },
      {
        path: "website-terms-use",
        loadComponent: () =>
          import("./pages/website-terms-use/website-terms-use.component").then(
            (m) => m.WebsiteTermsUseComponent,
          ),
        title: "Website Terms of Use | Flighthelpbuddy",
        data: {
          metaTitle: "Terms and Conditions | Flighthelpbuddy",
          metaDescription:
            "Please read the details of the Terms and Conditions of Flighthelpbuddy before initiating any bookings. Fly to domestic and international destinations easy!",
        },
      },
      {
        path: "policy",
        loadComponent: () =>
          import("./pages/policy/policy.component").then(
            (m) => m.PolicyComponent,
          ),
        title: "Privacy Policy and Cookie Notice | Flighthelpbuddy",
        data: {
          metaTitle: "Privacy Policy and Cookie Notice | Flighthelpbuddy",
          metaDescription:
            "Please read the details of the Privacy Policy and Cookie Notice of Flighthelpbuddy before initiating any bookings. Fly to domestic and international destinations easy!",
        },
      },
      {
        path: "cookie-policy",
        loadComponent: () =>
          import("./pages/cookie-policy/cookie-policy.component").then(
            (m) => m.CookiePolicyComponent,
          ),
        title: "Cookie Use & Management Policy Flighthelpbuddy",
        data: {
          metaTitle: "Cookie Use & Management Policy Flighthelpbuddy",
          metaDescription:
            "Find out how we use cookies, third-party tools, and analytics to improve website performance and your experience.",
        },
      },
      {
        path: "privacy-policy",
        loadComponent: () =>
          import("./pages/privacy-policy/privacy-policy.component").then(
            (m) => m.PrivacyPolicyComponent,
          ),
        title: "Your Privacy Policy | Flighthelpbuddy",
        data: {
          metaTitle: "Your Privacy Policy | Flighthelpbuddy",
          metaDescription:
            "Understand the way we handle your personal information, cookies, bookings, payments, and data protection.",
        },
      },
      {
        path: "disclaimer",
        loadComponent: () =>
          import("./pages/disclaimer/disclaimer.component").then(
            (m) => m.DisclaimerComponent,
          ),
        title: "Disclaimer Policy | Flighthelpbuddy",
        data: {
          metaTitle: "Disclaimer Policy | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Disclaimer Policy of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "info/generaltermsandconditions/GPR",
        loadComponent: () =>
          import("./pages/global-privacy-right/global-privacy-right.component").then(
            (m) => m.GlobalPrivacyRightComponent,
          ),
        title: "Global Privacy Rights | Flighthelpbuddy",
        data: {
          metaTitle: "Global Privacy Rights | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Global Privacy Rights of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },

      {
        path: "info/generaltermsandconditions/compassion-exception-policy",
        loadComponent: () =>
          import("./pages/compassion-exception-policy/compassion-exception-policy.component").then(
            (m) => m.CompassionExceptionPolicyComponent,
          ),
        title: "Compassion Exception Policy | Flighthelpbuddy",
        data: {
          metaTitle: "Compassion Exception Policy | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Compassion Exception Policy of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "info/generaltermsandconditions/DDP",
        loadComponent: () =>
          import("./pages/disclaimer-discount-policy/disclaimer-discount-policy.component").then(
            (m) => m.DisclaimerDiscountPolicyComponent,
          ),
        title: "Disclaimer & Discount Policy | Flighthelpbuddy",
        data: {
          metaTitle: "Disclaimer & Discount Policy | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Disclaimer & Discount Policy of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "info/generaltermsandconditions/PERSONAL_INFORMATION",
        loadComponent: () =>
          import("./pages/personal-information-policy/personal-information-policy.component").then(
            (m) => m.PersonalInformationPolicyComponent,
          ),
        title: "Personal Information Policy | Flighthelpbuddy",
        data: {
          metaTitle: "Personal Information Policy | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Personal Information Policy of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "info/generaltermsandconditions/TMT",
        loadComponent: () =>
          import("./pages/travels-text-message-terms/travels-text-message-terms.component").then(
            (m) => m.TravelsTextMessageTermsComponent,
          ),
        title: "Travels Text Message Terms | Flighthelpbuddy",
        data: {
          metaTitle: "Travels Text Message Terms | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Travels Text Message Terms of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "pr-notice-california",
        loadComponent: () =>
          import("./pages/privacy-notice-california/privacy-notice-california.component").then(
            (m) => m.PrivacyNoticeCaliforniaComponent,
          ),
        title: "Privacy Notice California | Flighthelpbuddy",
        data: {
          metaTitle: "Privacy Notice California | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Privacy Notice California of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "price-match-promise",
        loadComponent: () =>
          import("./pages/price-match-promise/price-match-promise.component").then(
            (m) => m.PriceMatchPromiseComponent,
          ),
        title: "Price Match Promise | Flighthelpbuddy",
        data: {
          metaTitle: "Price Match Promise | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Price Match Promise of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "customer-notification-policy",
        loadComponent: () =>
          import("./pages/customer-notification-policy/customer-notification-policy.component").then(
            (m) => m.CustomerNotificationPolicyComponent,
          ),
        title: "Customer Notification Policy | Flighthelpbuddy",
        data: {
          metaTitle: "Customer Notification Policy | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of Customer Notification Policy of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "gdpr-privacy-notice",
        loadComponent: () =>
          import("./pages/gdpr-privacy-notice/gdpr-privacy-notice.component").then(
            (m) => m.GdprPrivacyNoticeComponent,
          ),
        title: "GDPR Privacy Notice | Flighthelpbuddy",
        data: {
          metaTitle: "GDPR Privacy Notice | Flighthelpbuddy",
          metaDescription:
            "Click now to get all the details of GDPR Privacy Notice of Flighthelpbuddy. Save big while you fly to some of the most exotic destinations of the globe.",
        },
      },
      {
        path: "testimonials",
        loadComponent: () =>
          import("./pages/testimonials/testimonials.component").then(
            (m) => m.TestimonialsComponent,
          ),
        title: "Honest Traveler Stories | Infinity Travel",
        data: {
          metaTitle: "Honest Traveler Stories | Infinity Travel",
          metaDescription:
            "Hear what travelers say about their flight, hotel and cruise bookings. Honest reviews from people who planned smooth and happy getaways.",
        },
      },
      {
        path: "support",
        loadComponent: () =>
          import("./pages/support/support.component").then(
            (m) => m.SupportComponent,
          ),
        title: "Customer Support | Flighthelpbuddy",
        data: {
          metaTitle: "Customer Support | Flighthelpbuddy",
          metaDescription:
            "Need help? Contact Flighthelpbuddy customer support for assistance with bookings, cancellations, and travel inquiries. We're here for you 24/7.",
        },
      },
      {
        path: "careers",
        loadComponent: () =>
          import("./pages/careers/careers.component").then(
            (m) => m.CareersComponent,
          ),
        title: "Careers at Flighthelpbuddy | Join Our Team",
        data: {
          metaTitle: "Careers at Flighthelpbuddy | Join Our Team",
          metaDescription:
            "Looking for a rewarding career in travel? Explore exciting job opportunities at Flighthelpbuddy and grow with a passionate team.",
        },
      },
      {
        path: "careers/job-details/:id",
        loadComponent: () =>
          import("./pages/careers/job-details/job-details.component").then(
            (m) => m.JobDetailsComponent,
          ),
        title: "Careers at Flighthelpbuddy | Join Our Team",
        data: {
          metaTitle: "Careers at Flighthelpbuddy | Join Our Team",
          metaDescription:
            "Looking for a rewarding career in travel? Explore exciting job opportunities at Flighthelpbuddy and grow with a passionate team.",
        },
      },
      {
        path: "our-service-fees",
        loadComponent: () =>
          import("./pages/our-service-fees/our-service-fees.component").then(
            (m) => m.OurServiceFeesComponent,
          ),
        title:
          "Fees & Taxes | Transparent Pricing & Service Fees | Flighthelpbuddy",
        data: {
          metaTitle:
            "Fees & Taxes | Transparent Pricing & Service Fees | Flighthelpbuddy",
          metaDescription:
            "Understand fees, taxes, service charges, and transaction costs. View an estimated fee breakdown and know your total price before payment.",
        },
      },
      {
        path: "post-ticketing-fees",
        loadComponent: () =>
          import("./pages/post-ticketing-fees/post-ticketing-fees.component").then(
            (m) => m.PostTicketingFeesComponent,
          ),
        title:
          "Cancellation, Refund & Exchange Policy | Service Fees & Terms | Flighthelpbuddy",
        data: {
          metaTitle:
            "Cancellation, Refund & Exchange Policy | Service Fees & Terms | Flighthelpbuddy",
          metaDescription:
            "Learn about service fees, refund eligibility, and cancellation policies. Transparent pricing with no hidden charges, plus details on our Compassion Exception Policy.",
        },
      },
      {
        path: "special-deal",
        loadComponent: () =>
          import("./pages/flight/top-airlines-deals/top-airlines-deals.component").then(
            (m) => m.TopAirlinesDealsComponent,
          ),
        title: "Best Flight Discounts 2025 | Infinity Travel",
        data: {
          metaTitle: "Best Flight Discounts 2025 | Infinity Travel",
          metaDescription:
            "Check out the best airline deals for 2025. Compare top airlines, save on domestic and international travel, and book the tickets. Click here!",
        },
      },
      {
        path: "cancellation-policy",
        loadComponent: () =>
          import("./pages/cancellation-policy/cancellation-policy.component").then(
            (m) => m.CancellationPolicyComponent,
          ),
        title:
          "Flexible Booking & Cancellation Policy | Easy Travel Support | Flighthelpbuddy",
        data: {
          metaTitle:
            "Flexible Booking & Cancellation Policy | Easy Travel Support | Flighthelpbuddy",
          metaDescription:
            "Easily change your travel dates or request a booking cancellation. Contact our travel specialists for quick refund assistance and 24/7 support.",
        },
      },
      {
        path: "terms-and-conditions",
        loadComponent: () =>
          import("./pages/terms-and-conditions/terms-and-conditions.component").then(
            (m) => m.TermsAndConditionsComponent,
          ),
        title: "Terms and Conditions | Flighthelpbuddy",
        data: {
          metaTitle: "Terms and Conditions | Flighthelpbuddy",
          metaDescription:
            "Review the Terms and Conditions for booking flights, hotels, car rentals, and cruises. Learn about our booking policies, privacy, and services.",
        },
      },
      {
        path: "top-routes",
        loadComponent: () =>
          import("./pages/top-routes/top-routesmain/top-routesmain.component").then(
            (m) => m.TopRoutesmainComponent,
          ),

        resolve: {
          topRouteData: topRoutesResolver,
        },
        title: "Top Travel Routes | Flighthelpbuddy",
        data: {
          metaTitle: "Top Travel Routes | Flighthelpbuddy",
          metaDescription:
            "Discover the best travel routes planned by Flighthelpbuddy for your perfect journey with our top destinations and smooth connections. Click here!",
        },
      },
      {
        path: "top-routes/:origin",
        loadComponent: () =>
          import("./pages/top-routes/top-routes.component").then(
            (m) => m.TopRoutesComponent,
          ),
        resolve: {
          topRouteDetailsData: topRoutesDetailsResolver,
        },
      },
      {
        path: "thankyou",
        loadComponent: () =>
          import("./components/thankyou/thankyou.component").then(
            (m) => m.ThankyouComponent,
          ),
        title: "Thank You | Flighthelpbuddy",
        data: {
          metaTitle: "Thank You | Flighthelpbuddy",
          metaDescription:
            "Thank you for choosing Flighthelpbuddy! We’ve received your request and will get back to you shortly with the details for your dream journey.",
        },
      },
      {
        path: "cruise-lines",
        loadComponent: () =>
          import("./pages/cruise-lines/cruise-lines.component").then(
            (m) => m.CruiseLinesComponent,
          ),
        resolve: {
          cruiselines: cruiseLinesResolver,
        },
        title: "Explore Cruise Lines | Flighthelpbuddy",
        data: {
          metaTitle: "Explore Cruise Lines | Flighthelpbuddy",
          metaDescription:
            "Sail away with Flighthelpbuddy! Explore a wide selection of cruise lines and find the perfect voyage for your next adventure on the seas.",
        },
      },
      {
        path: "cruise-lines/:cruise",
        loadComponent: () =>
          import("./pages/cruise-lines/details/details.component").then(
            (m) => m.DetailsComponent,
          ),
        resolve: {
          cruiselinesDetails: cruiseDetailsResolver,
        },
      },
      {
        path: "top-destinations",
        loadComponent: () =>
          import("./pages/top-destinations/top-destination/top-destination.component").then(
            (m) => m.TopDestinationComponent,
          ),
        resolve: {
          topDestinationData: topDestinationResolver,
        },
        title:
          "Find The World's Best Travel Destinations To Visit | Flighthelpbuddy",
        data: {
          metaTitle:
            "Find The World's Best Travel Destinations To Visit | Flighthelpbuddy",
          metaDescription:
            "Choose to fly with Flighthelpbuddy to find the world's best travel destinations to visit and make the best memories with your loved ones. Book your tickets today.",
        },
      },
      {
        path: "top-destinations/:slug",
        loadComponent: () =>
          import("./pages/top-destinations/top-destination/top-destination-details/top-destination-details.component").then(
            (m) => m.TopDestinationDetailsComponent,
          ),
        resolve: {
          topDestinationDetailsData: topDestinationDetailsResolver,
          allDestinations: DestinationsResolver,
        },
      },
      {
        path: "packages",
        loadComponent: () =>
          import("./pages/packages/packages.component").then(
            (m) => m.PackagesComponent,
          ),
        title:
          "Vacation Packages & Cheap Travel Deals | Book Flights, Hotels & Cars | Flighthelpbuddy",

        data: {
          metaTitle:
            "Vacation Packages & Cheap Travel Deals | Book Flights, Hotels & Cars | Flighthelpbuddy",
          metaDescription:
            "Discover affordable vacation packages with bundled rates on flights, hotels, and car rentals. Enjoy transparent pricing and 24/7 expert travel support.",
        },
      },
      {
        path: "top-hotel/bali",
        loadComponent: () =>
          import("./pages/top-hotels/bali/bali.component").then(
            (m) => m.BaliComponent,
          ),
      },
      {
        path: "top-hotel/bangkok",
        loadComponent: () =>
          import("./pages/top-hotels/bangkok/bangkok.component").then(
            (m) => m.BangkokComponent,
          ),
      },
      {
        path: "top-hotel/dubai",
        loadComponent: () =>
          import("./pages/top-hotels/dubai/dubai.component").then(
            (m) => m.DubaiComponent,
          ),
      },
      {
        path: "top-hotel/kuala-lumpur",
        loadComponent: () =>
          import("./pages/top-hotels/kuala-lumper/kuala-lumper.component").then(
            (m) => m.KualaLumperComponent,
          ),
      },
      {
        path: "top-hotel/paris",
        loadComponent: () =>
          import("./pages/top-hotels/paris-france/paris-france.component").then(
            (m) => m.ParisFranceComponent,
          ),
      },
      {
        path: "top-hotel/rome",
        loadComponent: () =>
          import("./pages/top-hotels/rome/rome.component").then(
            (m) => m.RomeComponent,
          ),
      },
      {
        path: "top-hotel/santorini",
        loadComponent: () =>
          import("./pages/top-hotels/santorini/santorini.component").then(
            (m) => m.SantoriniComponent,
          ),
      },
      {
        path: "top-hotel/zurich",
        loadComponent: () =>
          import("./pages/top-hotels/zurich/zurich.component").then(
            (m) => m.ZurichComponent,
          ),
      },
      {
        path: "clubmiles",
        loadComponent: () =>
          import("./pages/club-miles/club-miles.component").then(
            (m) => m.ClubMilesComponent,
          ),
        title: "Clubmiles Rewards Program | Flighthelpbuddy",
        data: {
          metaTitle: "Clubmiles Rewards Program | Flighthelpbuddy",
          metaDescription:
            "Join Flighthelpbuddy’ Clubmiles and earn exclusive rewards on every booking. Travel more, earn more, and enjoy special member benefits.",
        },
      },
      {
        path: "packages/:slug",
        loadComponent: () =>
          import("./pages/packages/package-detail/package-detail.component").then(
            (m) => m.PackageDetailComponent,
          ),
        title: "Travel Packages Information | Flighthelpbuddy",
        data: {
          metaTitle: "Travel Packages Information | Flighthelpbuddy",
          metaDescription:
            "Explore America’s iconic wilderness with geysers and stunning views with Flighthelpbuddy. Book the packages now & enjoy your escape!",
        },
      },

      {
        path: "top-destinations/florida",
        loadComponent: () =>
          import("./pages/top-destinations/florida/florida.component").then(
            (m) => m.FloridaComponent,
          ),
      },
      {
        path: "top-destinations/san-francisco",
        loadComponent: () =>
          import("./pages/top-destinations/san-francisco/san-francisco.component").then(
            (m) => m.SanFranciscoComponent,
          ),
      },
      {
        path: "top-destinations/singapore",
        loadComponent: () =>
          import("./pages/top-destinations/singapore/singapore.component").then(
            (m) => m.SingaporeComponent,
          ),
      },
      {
        path: "top-destinations/swis-alps",
        loadComponent: () =>
          import("./pages/top-destinations/swis-alps/swis-alps.component").then(
            (m) => m.SwisAlpsComponent,
          ),
      },
      {
        path: "top-destinations/kuala-lumpur",
        loadComponent: () =>
          import("./pages/top-destinations/kuala-lumpur/kuala-lumpur.component").then(
            (m) => m.KualaLumpurComponent,
          ),
      },
      {
        path: "top-destinations/sydney",
        loadComponent: () =>
          import("./pages/top-destinations/sydney/sydney.component").then(
            (m) => m.SydneyComponent,
          ),
      },
      {
        path: "top-destinations/tokyo",
        loadComponent: () =>
          import("./pages/top-destinations/tokyo/tokyo.component").then(
            (m) => m.TokyoComponent,
          ),
      },
      {
        path: "top-destinations/zurich",
        loadComponent: () =>
          import("./pages/top-destinations/zurich/zurich.component").then(
            (m) => m.ZurichComponent,
          ),
      },
      {
        path: "top-destinations",
        loadComponent: () =>
          import("./pages/top-destinations/top-destination/top-destination.component").then(
            (m) => m.TopDestinationComponent,
          ),
      },
      // {
      //   path: 'packages',
      //   loadComponent: () =>
      //     import('./pages/packages/packages.component').then(
      //       (m) => m.PackagesComponent
      //     ),
      // },
      {
        path: "hotel/bali",
        loadComponent: () =>
          import("./pages/top-hotels/bali/bali.component").then(
            (m) => m.BaliComponent,
          ),
        title: "Bali Travel Packages & Tours | Flighthelpbuddy",
        data: {
          metaTitle: "Bali Travel Packages & Tours | Flighthelpbuddy",
          metaDescription:
            "Relax on Bali’s beaches and explore its culture with Flighthelpbuddy. Your tropical escape starts here!",
        },
      },
      {
        path: "thotel/bangkok",
        loadComponent: () =>
          import("./pages/top-hotels/bangkok/bangkok.component").then(
            (m) => m.BangkokComponent,
          ),
      },
      {
        path: "hotel/dubai",
        loadComponent: () =>
          import("./pages/top-hotels/dubai/dubai.component").then(
            (m) => m.DubaiComponent,
          ),
        title: "Dubai Travel Deals & Packages | Flighthelpbuddy",
        data: {
          metaTitle: "Dubai Travel Deals & Packages | Flighthelpbuddy",
          metaDescription:
            "From luxury shopping to desert adventures, explore Dubai with Flighthelpbuddy. Your UAE holiday starts now!",
        },
      },
      {
        path: "hotel/kuala-lumpur",
        loadComponent: () =>
          import("./pages/top-hotels/kuala-lumper/kuala-lumper.component").then(
            (m) => m.KualaLumperComponent,
          ),
      },
      {
        path: "hotel/paris",
        loadComponent: () =>
          import("./pages/top-hotels/paris-france/paris-france.component").then(
            (m) => m.ParisFranceComponent,
          ),
      },
      {
        path: "hotel/rome",
        loadComponent: () =>
          import("./pages/top-hotels/rome/rome.component").then(
            (m) => m.RomeComponent,
          ),
        title: "Rome Tour Packages & Holidays | Flighthelpbuddy",
        data: {
          metaTitle: "Rome Tour Packages & Holidays | Flighthelpbuddy",
          metaDescription:
            "Walk through history in Rome with Flighthelpbuddy. From the Colosseum to Vatican City, your Italian journey awaits!",
        },
      },
      {
        path: "hotel/santorini",
        loadComponent: () =>
          import("./pages/top-hotels/santorini/santorini.component").then(
            (m) => m.SantoriniComponent,
          ),
      },
      {
        path: "hotel/zurich",
        loadComponent: () =>
          import("./pages/top-hotels/zurich/zurich.component").then(
            (m) => m.ZurichComponent,
          ),
      },
      {
        path: "hotel/venice",
        loadComponent: () =>
          import("./pages/top-hotels/venic/venic.component").then(
            (m) => m.VenicComponent,
          ),
        title: "Venice Tours & Holiday Packages | Flighthelpbuddy",
        data: {
          metaTitle: "Venice Tours & Holiday Packages | Flighthelpbuddy",
          metaDescription:
            "Gondolas, canals, and romance! Discover Venice with Flighthelpbuddy. A timeless Italian experience awaits.",
        },
      },
      {
        path: "hotel/hong-kong",
        loadComponent: () =>
          import("./pages/top-hotels/hongkong/hongkong.component").then(
            (m) => m.HongkongComponent,
          ),
        title: "Hong Kong Tour Packages | Flighthelpbuddy",
        data: {
          metaTitle: "Hong Kong Tour Packages | Flighthelpbuddy",
          metaDescription:
            "Skyscrapers, culture, and cuisine! Explore Hong Kong with Flighthelpbuddy. Book your Asia getaway today.",
        },
      },
      {
        path: "under-maintenance",
        loadComponent: () =>
          import("./pages/under-maintenance/under-maintenance.component").then(
            (m) => m.UnderMaintenanceComponent,
          ),
      },
      {
        path: "package-booking-details",
        loadComponent: () =>
          import("./pages/packages/package-book/package-book.component").then(
            (m) => m.PackageBookComponent,
          ),
      },
      {
        path: "select-package",
        loadComponent: () =>
          import("./pages/packages/select-package/select-package.component").then(
            (m) => m.SelectPackageComponent,
          ),
      },
      // {
      //   path: 'group-flight-booking-discount',
      //   loadComponent: () =>
      //     import('./pages/group-flight/group-flight.component').then(
      //       (m) => m.GroupFlightComponent
      //     ),

      // },
      {
        path: "deals/cheap-red-eye-flights",
        loadComponent: () =>
          import("./pages/cheap-red-eye-flights/cheap-red-eye-flights.component").then(
            (m) => m.CheapRedEyeFlightsComponent,
          ),
        title: "Book Cheap Red-Eye Flights - Airlines tickets | Flighthelpbuddy",
        data: {
          metaTitle:
            "Book Cheap Red-Eye Flights - Airlines tickets | Flighthelpbuddy",
          metaDescription:
            "Book cheap red-eye flights with Flighthelpbuddy for late-night travel savings. Explore exclusive flight, affordable overnight flight deals today!",
        },
      },
      {
        path: "deals",
        loadComponent: () =>
          import("./pages/speacial-deals/speacial-deals.component").then(
            (m) => m.SpeacialDealsComponent,
          ),
        resolve: { deals: dealResolver },
      },

      {
        path: "deals/:slug",
        loadComponent: () =>
          import("./pages/speacial-deals/deal-details/deal-details.component").then(
            (m) => m.DealDetailsComponent,
          ),
        resolve: { dealDetails: dealsResolver },
      },

      {
        path: "packages-book",
        loadComponent: () =>
          import("./pages/packages/select-package/package-checkout/package-checkout.component").then(
            (m) => m.PackageCheckoutComponent,
          ),
      },
      {
        path: "cheap-domestic-flights",
        loadComponent: () =>
          import("./pages/cheap-domestic-flights/cheap-domestic-flights.component").then(
            (m) => m.CheapDomesticFlightsComponent,
          ),
        title:
          "Cheap Domestic Flights in USA - Airlines Tickets | Flighthelpbuddy",
        data: {
          metaTitle:
            "Cheap Domestic Flights in USA - Airlines Tickets | Flighthelpbuddy",
          metaDescription:
            "Book cheap domestic flights in the US. One-way or round-trip with Flighthelpbuddy. Instant booking, 24/7 support, and no hidden fees. Call (888) 975-1707.",
        },
      },
      {
        path: "group-flight-booking-discount",
        loadComponent: () =>
          import("./pages/group-flight-booking-discount/group-flight-booking-discount.component").then(
            (m) => m.GroupFlightBookingDiscountComponent,
          ),
        title: "Find Group Flight Booking Discount | Flighthelpbuddy",
        data: {
          metaTitle: "Find Group Flight Booking Discount | Flighthelpbuddy",
          metaDescription:
            "Save big on group flight bookings with Flighthelpbuddy! Call 1 (800) 645-3851 now for exclusive discounts on travel for families, friends, or corporate groups.",
        },
      },
      {
        path: "cheap-international-flights",
        loadComponent: () =>
          import("./pages/cheap-international-flights/cheap-international-flights.component").then(
            (m) => m.CheapInternationalFlightsComponent,
          ),
        title:
          "Cheap International Flights in USA - Airlines Tickets | Flighthelpbuddy",
        data: {
          metaTitle:
            "Cheap International Flights in USA - Airlines Tickets | Flighthelpbuddy",
          metaDescription:
            "Find cheap international flights with Flighthelpbuddy. Get the best fares worldwide—call 1 (800) 645-3851 now for deals and 24/7 booking support!",
        },
      },
      {
        path: "taxes-and-fees-canada",
        loadComponent: () =>
          import("./pages/taxes-and-fees/taxes-and-fees-of-canada/taxes-and-fees-of-canada.component").then(
            (m) => m.TaxesAndFeesOfCanadaComponent,
          ),
        title: "Taxes & Fees - Airlines Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Taxes & Fees - Airlines Tickets | Flighthelpbuddy",
          metaDescription:
            "Find information about taxes and fees for flights with Flighthelpbuddy. Call 1 (800) 645-3851 for assistance!",
        },
      },
      {
        path: "taxes-and-fees-usa",
        loadComponent: () =>
          import("./pages/taxes-and-fees/taxes-and-fees-of-us/taxes-and-fees-of-us.component").then(
            (m) => m.TaxesAndFeesOfUsComponent,
          ),
        title: "Taxes & Fees - Airlines Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Taxes & Fees - Airlines Tickets | Flighthelpbuddy",
          metaDescription:
            "Find information about taxes and fees for flights with Flighthelpbuddy. Call 1 (800) 645-3851 for assistance!",
        },
      },
      {
        path: "baggage",
        loadComponent: () =>
          import("./pages/bagage-info/bagage-info.component").then(
            (m) => m.BagageInfoComponent,
          ),
      },
      {
        path: "affiliate-program",
        loadComponent: () =>
          import("./pages/affiliate-program/affiliate-program.component").then(
            (m) => m.AffiliateProgramComponent,
          ),
        title: "Affiliate Program - Airlines Tickets | Flighthelpbuddy",
        data: {
          metaTitle: "Affiliate Program - Airlines Tickets | Flighthelpbuddy",
          metaDescription:
            "Find information about affiliate program for flights with Flighthelpbuddy. Call 1 (800) 645-3851 for assistance!",
        },
      },
      {
        path: "hotel-privacy-cookie-policy",
        loadComponent: () =>
          import("./pages/hotel-privacy-cookie-policy/hotel-privacy-cookie-policy.component").then(
            (m) => m.HotelPrivacyCookiePolicyComponent,
          ),
      },
      {
        path: "booking-in-progress",
        loadComponent: () =>
          import("./pages/booking-in-progress/booking-in-progress.component").then(
            (m) => m.BookingInProgressComponent,
          ),
      },
      {
        path: "seat-preference-no-results",
        loadComponent: () =>
          import("./pages/seat-preference-no-results/seat-preference-no-results.component").then(
            (m) => m.SeatPreferenceNoResultsComponent,
          ),
      },
      {
        path: "checked-luggage-sizes",
        loadComponent: () =>
          import("./pages/checked-luggage-sizes/checked-luggage-sizes.component").then(
            (m) => m.CheckedLuggageSizesComponent,
          ),
      },
      {
        path: "top-deals",
        loadComponent: () =>
          import("./pages/top-deals/top-deals.component").then(
            (m) => m.TopDealsComponent,
          ),
      },

      {
        path: "airlines",
        loadComponent: () =>
          import("./pages/airlines/airlines.component").then(
            (m) => m.AirlinesComponent,
          ),
        title: "Airlines | Book Cheap Airline Tickets & Flights | Flighthelpbuddy",
        data: {
          metaTitle:
            "Airlines | Book Cheap Airline Tickets & Flights | Flighthelpbuddy",
          metaDescription:
            "Explore airlines, flight routes, and affordable airfare options with Flighthelpbuddy. Find and book airline tickets for your next journey.",
        },
      },

      {
        path: "airlines/air-mauritius",
        loadComponent: () =>
          import("./pages/airlines/air-mauritius/air-mauritius.component").then(
            (m) => m.AirMauritiusComponent,
          ),
        title: "Air Mauritius Flights, Routes & Deals | Flighthelpbuddy",
        data: {
          metaTitle: "Air Mauritius Flights, Routes & Deals | Flighthelpbuddy",
          metaDescription:
            "Book Air Mauritius flights and explore routes, deals, and affordable airfare options with Flighthelpbuddy.",
        },
      },
      {
        path: "airlines/brussels-airlines",
        loadComponent: () =>
          import("./pages/airlines/brussels-airlines/brussels-airlines.component").then(
            (m) => m.BrusselsAirlinesComponent,
          ),
        title: "Brussels Airlines Flights, Routes & Deals | Flighthelpbuddy",
        data: {
          metaTitle: "Brussels Airlines Flights, Routes & Deals | Flighthelpbuddy",
          metaDescription:
            "Explore Brussels Airlines flights, routes, and affordable booking options with Flighthelpbuddy.",
        },
      },
      {
        path: "airlines/ethiopian-airlines",
        loadComponent: () =>
          import("./pages/airlines/ethiopian-airlines/ethiopian-airlines.component").then(
            (m) => m.EthiopianAirlinesComponent,
          ),
        title: "Ethiopian Airlines Flights, Routes & Deals | Flighthelpbuddy",
        data: {
          metaTitle:
            "Ethiopian Airlines Flights, Routes & Deals | Flighthelpbuddy",
          metaDescription:
            "Find Ethiopian Airlines flights, routes, and affordable airfare deals with Flighthelpbuddy.",
        },
      },
      {
        path: "airlines/hawaiian-airlines",
        loadComponent: () =>
          import("./pages/airlines/hawaiian-airlines/hawaiian-airlines.component").then(
            (m) => m.HawaiianAirlinesComponent,
          ),
        title: "Hawaiian Airlines Flights, Routes & Deals | Flighthelpbuddy",
        data: {
          metaTitle: "Hawaiian Airlines Flights, Routes & Deals | Flighthelpbuddy",
          metaDescription:
            "Book Hawaiian Airlines flights and explore routes, prices, and deals with Flighthelpbuddy.",
        },
      },

      {
        path: "international-route",
        loadComponent: () =>
          import("./pages/international-route/international-route.component").then(
            (m) => m.InternationalRouteComponent,
          ),
        title:
          "International Flight Routes | Book Affordable Flights | Flighthelpbuddy",
        data: {
          metaTitle:
            "International Flight Routes | Book Affordable Flights | Flighthelpbuddy",
          metaDescription:
            "Explore international flight routes, compare airfare options, and find affordable flights for your next journey with Flighthelpbuddy.",
        },
      },

      {
        path: "international-route/washington_dc-to-miami-flights",
        loadComponent: () =>
          import("./pages/international-route/washington-dc-to-miami-flights/washington-dc-to-miami-flights.component").then(
            (m) => m.WashingtonDcToMiamiFlightsComponent,
          ),
        title: "Washington DC To Miami Flights | Flighthelpbuddy",
        data: {
          metaTitle: "Washington DC To Miami Flights | Flighthelpbuddy",
          metaDescription:
            "Book affordable flights from Washington DC to Miami with Flighthelpbuddy. Compare flight options and find the best airfare deals.",
        },
      },
      {
        path: "international-route/dallas-to-new_york_city-flights",
        loadComponent: () =>
          import("./pages/international-route/dallas-to-new-york-city-flights/dallas-to-new-york-city-flights.component").then(
            (m) => m.DallasToNewYorkCityFlightsComponent,
          ),
        title: "Dallas To New York City Flights | Flighthelpbuddy",
        data: {
          metaTitle: "Dallas To New York City Flights | Flighthelpbuddy",
          metaDescription:
            "Find affordable flights from Dallas to New York City with Flighthelpbuddy. Compare airfare options and book your flight at competitive prices.",
        },
      },
      {
        path: "international-route/columbia-to-orlando-flights",
        loadComponent: () =>
          import("./pages/international-route/columbia-to-orlando-flights/columbia-to-orlando-flights.component").then(
            (m) => m.ColumbiaToOrlandoFlightsComponent,
          ),
        title: "Columbia To Orlando Flights | Flighthelpbuddy",
        data: {
          metaTitle: "Columbia To Orlando Flights | Flighthelpbuddy",
          metaDescription:
            "Explore affordable flights from Columbia to Orlando with Flighthelpbuddy. Compare available airfare and find suitable flight options for your journey.",
        },
      },
      {
        path: "international-route/tampa-to-knoxville-flights",
        loadComponent: () =>
          import("./pages/international-route/tampa-to-knoxville-flights/tampa-to-knoxville-flights.component").then(
            (m) => m.TampaToKnoxvilleFlightsComponent,
          ),
        title: "Tampa To Knoxville Flights | Flighthelpbuddy",
        data: {
          metaTitle: "Tampa To Knoxville Flights | Flighthelpbuddy",
          metaDescription:
            "Book flights from Tampa to Knoxville with Flighthelpbuddy. Compare available flight options and discover affordable airfare deals.",
        },
      },

      {
        path: "flights-destination",
        loadComponent: () =>
          import("./pages/flights-destination/flights-destination.component").then(
            (m) => m.FlightsDestinationComponent,
          ),
        title: "Top Flight Destinations | Flighthelpbuddy",
        data: {
          metaTitle: "Top Flight Destinations | Flighthelpbuddy",
          metaDescription:
            "Find and compare cheap flights from hundreds of airlines. Explore affordable airfare and book domestic or international flights with ease.",
        },
      },

      {
        path: "flights-destination/flights-to-new_york_city",
        loadComponent: () =>
          import("./pages/flights-destination/flights-to-new-york-city/flights-to-new-york-city.component").then(
            (m) => m.FlightsToNewYorkCityComponent,
          ),
        title: "Flights to New York City | Flighthelpbuddy",
        data: {
          metaTitle: "Flights to New York City | Flighthelpbuddy",
          metaDescription:
            "Find affordable flights to New York City with Flighthelpbuddy. Explore flight options, compare fares, and book your journey.",
        },
      },
      {
        path: "flights-destination/flights-to-washington_dc",
        loadComponent: () =>
          import("./pages/flights-destination/flights-to-washington-dc/flights-to-washington-dc.component").then(
            (m) => m.FlightsToWashingtonDcComponent,
          ),
        title: "Flights to Washington DC | Flighthelpbuddy",
        data: {
          metaTitle: "Flights to Washington DC | Flighthelpbuddy",
          metaDescription:
            "Book affordable flights to Washington DC with Flighthelpbuddy. Compare available airfare options and find the best flight deals.",
        },
      },
      {
        path: "flights-destination/flights-to-san_francisco",
        loadComponent: () =>
          import("./pages/flights-destination/flights-to-san-francisco/flights-to-san-francisco.component").then(
            (m) => m.FlightsToSanFranciscoComponent,
          ),
        title: "Flights to San Francisco | Flighthelpbuddy",
        data: {
          metaTitle: "Flights to San Francisco | Flighthelpbuddy",
          metaDescription:
            "Explore affordable flights to San Francisco with Flighthelpbuddy. Compare flight options and book your next trip at competitive prices.",
        },
      },
      {
        path: "flights-destination/flights-to-denver",
        loadComponent: () =>
          import("./pages/flights-destination/flights-to-denver/flights-to-denver.component").then(
            (m) => m.FlightsToDenverComponent,
          ),
        title: "Flights to Denver | Flighthelpbuddy",
        data: {
          metaTitle: "Flights to Denver | Flighthelpbuddy",
          metaDescription:
            "Find affordable flights to Denver with Flighthelpbuddy. Compare airfare options and discover suitable flights for your journey.",
        },
      },

      {
        path: "airlines-routes",
        loadComponent: () =>
          import("./pages/airlines-routes/airlines-routes.component").then(
            (m) => m.AirlinesRoutesComponent,
          ),
        title: "Airline Routes & Flight Information | Flighthelpbuddy",
        data: {
          metaTitle: "Airline Routes & Flight Information | Flighthelpbuddy",
          metaDescription:
            "Explore airline routes, flight schedules, and available destinations. Compare flight options and find affordable airfare with Flighthelpbuddy.",
        },
      },
      {
        path: "airlines-routes/american-airlines_los_angeles-to-atlanta",
        loadComponent: () =>
          import("./pages/airlines-routes/american-airlines-los-angeles-to-atlanta/american-airlines-los-angeles-to-atlanta.component").then(
            (m) => m.AmericanAirlinesLosAngelesToAtlantaComponent,
          ),
        title:
          "American Airlines Los Angeles To Atlanta Flights | Flighthelpbuddy",
        data: {
          metaTitle:
            "American Airlines Los Angeles To Atlanta Flights | Flighthelpbuddy",
          metaDescription:
            "Book American Airlines flights from Los Angeles to Atlanta with Flighthelpbuddy. Compare flight options and find affordable airfare deals.",
        },
      },
      {
        path: "airlines-routes/united-airlines_austin-to-washington_dc",
        loadComponent: () =>
          import("./pages/airlines-routes/united-airlines-austin-to-washington-dc/united-airlines-austin-to-washington-dc.component").then(
            (m) => m.UnitedAirlinesAustinToWashingtonDcComponent,
          ),
        title: "United Airlines Austin To Washington DC Flights | Flighthelpbuddy",
        data: {
          metaTitle:
            "United Airlines Austin To Washington DC Flights | Flighthelpbuddy",
          metaDescription:
            "Explore United Airlines flights from Austin to Washington DC with Flighthelpbuddy. Compare airfare options and book your next journey.",
        },
      },
      {
        path: "airlines-routes/american-airlines_cleveland-to-atlanta",
        loadComponent: () =>
          import("./pages/airlines-routes/american-airlines-cleveland-to-atlanta/american-airlines-cleveland-to-atlanta.component").then(
            (m) => m.AmericanAirlinesClevelandToAtlantaComponent,
          ),
        title: "American Airlines Cleveland To Atlanta Flights | Flighthelpbuddy",
        data: {
          metaTitle:
            "American Airlines Cleveland To Atlanta Flights | Flighthelpbuddy",
          metaDescription:
            "Find American Airlines flights from Cleveland to Atlanta with Flighthelpbuddy. Compare available flights and discover affordable airfare deals.",
        },
      },
      {
        path: "airlines-routes/united-airlines_los_angeles-to-orlando",
        loadComponent: () =>
          import("./pages/airlines-routes/united-airlines-los-angeles-to-orlando/united-airlines-los-angeles-to-orlando.component").then(
            (m) => m.UnitedAirlinesLosAngelesToOrlandoComponent,
          ),
        title: "United Airlines Los Angeles To Orlando Flights | Flighthelpbuddy",
        data: {
          metaTitle:
            "United Airlines Los Angeles To Orlando Flights | Flighthelpbuddy",
          metaDescription:
            "Book United Airlines flights from Los Angeles to Orlando with Flighthelpbuddy. Compare flight options and find competitive airfare prices.",
        },
      },

      {
        path: "airlines-destination",
        loadComponent: () =>
          import("./pages/airlines-destination/airlines-destination.component").then(
            (m) => m.AirlinesDestinationComponent,
          ),
        title: "Airline Destinations & Flight Deals | Flighthelpbuddy",
        data: {
          metaTitle: "Airline Destinations & Flight Deals | Flighthelpbuddy",
          metaDescription:
            "Explore airline destinations and flight deals. Find affordable airfare options and compare flights for your preferred travel destination.",
        },
      },
      {
        path: "airlines-destination/allegiant-air_flights-to-tampa",
        loadComponent: () =>
          import("./pages/airlines-destination/allegiant-air-flights-to-tampa/allegiant-air-flights-to-tampa.component").then(
            (m) => m.AllegiantAirFlightsToTampaComponent,
          ),
        title: "Allegiant Air Flights to Tampa | Flighthelpbuddy",
        data: {
          metaTitle: "Allegiant Air Flights to Tampa | Flighthelpbuddy",
          metaDescription:
            "Find and book Allegiant Air flights to Tampa with Flighthelpbuddy. Compare airfare options and discover affordable flight deals.",
        },
      },
      {
        path: "airlines-destination/frontier-airlines_flights-to-chicago",
        loadComponent: () =>
          import("./pages/airlines-destination/frontier-airlines-flights-to-chicago/frontier-airlines-flights-to-chicago.component").then(
            (m) => m.FrontierAirlinesFlightsToChicagoComponent,
          ),
        title: "Frontier Airlines Flights to Chicago | Flighthelpbuddy",
        data: {
          metaTitle: "Frontier Airlines Flights to Chicago | Flighthelpbuddy",
          metaDescription:
            "Explore Frontier Airlines flights to Chicago with Flighthelpbuddy. Compare available flight options and find affordable airfare deals.",
        },
      },
      {
        path: "airlines-destination/american-airlines_flights-to-washington_dc",
        loadComponent: () =>
          import("./pages/airlines-destination/american-airlines-flights-to-washington-dc/american-airlines-flights-to-washington-dc.component").then(
            (m) => m.AmericanAirlinesFlightsToWashingtonDcComponent,
          ),
        title: "American Airlines Flights to Washington DC | Flighthelpbuddy",
        data: {
          metaTitle:
            "American Airlines Flights to Washington DC | Flighthelpbuddy",
          metaDescription:
            "Book American Airlines flights to Washington DC with Flighthelpbuddy. Compare flight options and find competitive airfare prices.",
        },
      },
      {
        path: "airlines-destination/united-airlines_flights-to-chicago",
        loadComponent: () =>
          import("./pages/airlines-destination/united-airlines-flights-to-chicago/united-airlines-flights-to-chicago.component").then(
            (m) => m.UnitedAirlinesFlightsToChicagoComponent,
          ),
        title: "United Airlines Flights to Chicago | Flighthelpbuddy",
        data: {
          metaTitle: "United Airlines Flights to Chicago | Flighthelpbuddy",
          metaDescription:
            "Explore United Airlines flights to Chicago with Flighthelpbuddy. Compare airfare options and find affordable flight deals.",
        },
      },

      {
        path: "travel-agency",
        loadComponent: () =>
          import("./pages/travel-agency/travel-agency.component").then(
            (m) => m.TravelAgencyComponent,
          ),
        title: "Online Travel Agent for Easy Booking | Flighthelpbuddy",
        data: {
          metaTitle: "Online Travel Agent for Easy Booking | Flighthelpbuddy",
          metaDescription:
            "Plan your next trip with a trusted online travel agent. Find flights and travel options that suit your budget and travel plans. ",
        },
      },
      {
        path: "tickets",
        loadComponent: () =>
          import("./pages/tickets/tickets.component").then(
            (m) => m.TicketsComponent,
          ),
        title:
          "Flight Tickets Booking: Convenient Travel Options Online | Flighthelpbuddy",
        data: {
          metaTitle:
            "Flight Tickets Booking: Convenient Travel Options Online | Flighthelpbuddy",
          metaDescription:
            "Find flight tickets that fit your travel plans with Flighthelpbuddy. Explore available options and get assistance with booking, seats, schedules, and changes! ",
        },
      },
      {
        path: "faq",
        loadComponent: () =>
          import("./pages/faq/faq.component").then((m) => m.FaqComponent),
        title: "Book Flights, Hotels, Cars & Vacation Packages | Flighthelpbuddy",
        data: {
          metaTitle:
            "Book Flights, Hotels, Cars & Vacation Packages | Flighthelpbuddy",
          metaDescription:
            "Plan your next journey with Flighthelpbuddy. Easily search, compare, and book affordable flights, hotel stays, rental cars, and vacation bundles - all in one place.",
        },
      },
      {
        path: "flights-booking",
        loadComponent: () =>
          import("./pages/flights-booking/flights-booking.component").then(
            (m) => m.FlightsBookingComponent,
          ),
        title: "Flight Booking – Affordable Flight Tickets | Flighthelpbuddy",
        data: {
          metaTitle:
            "Flight Booking – Affordable Flight Tickets | Flighthelpbuddy",
          metaDescription:
            "Book affordable flight tickets with Flighthelpbuddy. Explore domestic and international flights, compare available fares, and get assistance with your flight booking.",
        },
      },
      {
        path: "online-travel-agency",
        loadComponent: () =>
          import("./pages/online-travel-agency/online-travel-agency.component").then(
            (m) => m.OnlineTravelAgencyComponent,
          ),
        title: "Score Cheap Flights & Book Cheap Tickets Online | Flighthelpbuddy",
        data: {
          metaTitle:
            "Score Cheap Flights & Book Cheap Tickets Online | Flighthelpbuddy",
          metaDescription:
            "Lock in cheap flights and unbeatable travel deals with Flighthelpbuddy ! Snag fast bookings, flexible airline options, and 24/7 support for your next trip.",
        },
      },
       {
        path: "cheap-flights",
        loadComponent: () =>
          import("./pages/cheap-flights/cheap-flights.component").then(
            (m) => m.CheapFlightsComponent,
          ),
        title: "Lock In Cheap Flights & Save Big Today  | Flighthelpbuddy",
        data: {
          metaTitle:
            "Lock In Cheap Flights & Save Big Today  | Flighthelpbuddy",
          metaDescription:
            "Score low-cost airfares to your bucket-list destinations with Flighthelpbuddy! Enjoy instant bookings, zero hidden fees, and 24/7 support for every trip.",
        },
      },
      {
        path: "flight-change",
        loadComponent: () =>
          import("./pages/flight-change/flight-change.component").then(
            (m) => m.FlightChangeComponent,
          ),
        title: "Easy Flight Change Service: Update Your Travel Plans Now | Flighthelpbuddy",
        data: {
          metaTitle:
            "Easy Flight Change Service: Update Your Travel Plans Now | Flighthelpbuddy",
          metaDescription:
            "Looking to modify your flight? Review available schedules, explore alternative options, and get guidance with booking changes for a smoother travel experience.",
        },
      },
      {
        path: "flight-cancellation",
        loadComponent: () =>
          import("./pages/flight-cancellation/flight-cancellation.component").then(
            (m) => m.FlightCancellationComponent,
          ),
        title: "Simple Flight Cancellation: Get Help With Your Booking Now | Flighthelpbuddy",
        data: {
          metaTitle:
            "Simple Flight Cancellation: Get Help With Your Booking Now | Flighthelpbuddy",
          metaDescription:
            "Manage your flight cancellation with convenient support. Review booking details, ticket terms, cancellation requests, and available travel assistance with ease.",
        },
      },




{
  path: "last-minute-flights",
  loadComponent: () =>
    import("./pages/last-minute-flights/last-minute-flights.component").then(
      (m) => m.LastMinuteFlightsComponent,
    ),
  title: "Last-Minute Flight Deals | Book Cheap Flights Fast|Flighthelpbuddy",
  data: {
    metaTitle:
      "Last-Minute Flight Deals | Book Cheap Flights Fast|Flighthelpbuddy",
    metaDescription:
      "Find last-minute flight deals with flexible options, competitive fares, and 24/7 travel assistance. Compare flights and book your next trip with ease.",
  },
},

{
  path: "international-flights",
  loadComponent: () =>
    import("./pages/international-flights/international-flights.component").then(
      (m) => m.InternationalFlightsComponent,
    ),
  title: "Find International Flight Routes & Fares | Flighthelpbuddy",
  data: {
    metaTitle:
      "Find International Flight Routes & Fares | Flighthelpbuddy",
    metaDescription:
      "Looking for international flights? Explore popular routes, compare fares, and find flight options for your next journey.",
  },
},

{
  path: "domestic-flights",
  loadComponent: () =>
    import("./pages/domestic-flights/domestic-flights.component").then(
      (m) => m.DomesticFlightsComponent,
    ),
  title: "Domestic Flight Deals | Book Cheap Domestic Flights| Flighthelpbuddy",
  data: {
    metaTitle:
      "Domestic Flight Deals | Book Cheap Domestic Flights| Flighthelpbuddy",
    metaDescription:
      "Explore affordable domestic flight deals with flexible routes, transparent pricing, and 24/7 travel support. Compare options and book your domestic flight with ease.",
  },
},

{
  path: "one-way-deals",
  loadComponent: () =>
    import("./pages/one-way-deals/one-way-deals.component").then(
      (m) => m.OneWayDealsComponent,
    ),
  title: "One-Way Flight Deals | Book Cheap One-Way Flights| Flighthelpbuddy",
  data: {
    metaTitle:
      "One-Way Flight Deals | Book Cheap One-Way Flights| Flighthelpbuddy",
    metaDescription:
      "Explore one-way flight deals with flexible routes, competitive fares, transparent pricing, and 24/7 travel support. Compare options and book with ease.",
  },
},

{
  path: "round-trip-deals",
  loadComponent: () =>
    import("./pages/round-trip-deals/round-trip-deals.component").then(
      (m) => m.RoundTripDealsComponent,
    ),
  title: "Round-Trip Flights & Deals | Flighthelpbuddy",
  data: {
    metaTitle:
      "Round-Trip Flights & Deals | Flighthelpbuddy",
    metaDescription:
      "Find round-trip flights at competitive fares. Compare flight options, schedules, and routes to plan your next trip with ease.",
  },
},




{
  path: "ca/cheap-flights",
  loadComponent: () =>
    import("./pages/ca/cheap-flights/cheap-flights.component").then(
      (m) => m.CheapFlightsComponent,
    ),
  title: "Cheap Flights & Affordable Flight Deals | Flighthelpbuddy",
  data: {
    metaTitle: "Cheap Flights & Affordable Flight Deals | Flighthelpbuddy",
    metaDescription:
      "Find cheap flights and affordable airfare. Compare flight options, enjoy flexible schedules, and get expert assistance for easy booking.",
  },
},
{
  path: "ca/flight-change",
  loadComponent: () =>
    import("./pages/ca/flight-change/flight-change.component").then(
      (m) => m.FlightChangeComponent,
    ),
  title: "Need to Change Your Flight? Get Help Today | Flighthelpbuddy",
  data: {
    metaTitle: "Need to Change Your Flight? Get Help Today | Flighthelpbuddy",
    metaDescription:
      "Travel plans changed? Get assistance with flight changes, new travel dates, different flight times, and rebooking options.",
  },
},
{
  path: "ca/flight-cancellation",
  loadComponent: () =>
    import("./pages/ca/flight-cancellation/flight-cancellation.component").then(
      (m) => m.FlightCancellationComponent,
    ),
  title: "Flight Cancellation Assistance | Easy Cancellation Support | Flighthelpbuddy",
  data: {
    metaTitle:
      "Flight Cancellation Assistance | Easy Cancellation Support | Flighthelpbuddy",
    metaDescription:
      "Get easy flight cancellation assistance with expert guidance, help with cancellation policies, refund options, and 24/7 customer support. Call [CONTACT_NUMBER] for help.",
  },
},
{
  path: "ca/last-minute-flights",
  loadComponent: () =>
    import("./pages/ca/last-minute-flights/last-minute-flights.component").then(
      (m) => m.LastMinuteFlightsComponent,
    ),
  title: "Last-Minute Flight Booking | Flighthelpbuddy",
  data: {
    metaTitle: "Last-Minute Flight Booking | Flighthelpbuddy",
    metaDescription:
      "Traveling on short notice? Explore available last-minute flights, compare options, and get help with your travel plans.",
  },
},
{
  path: "ca/international-flights",
  loadComponent: () =>
    import("./pages/ca/international-flights/international-flights.component").then(
      (m) => m.InternationalFlightsComponent,
    ),
  title: "Book International Flights | International Flight Deals | Flighthelpbuddy",
  data: {
    metaTitle:
      "Book International Flights | International Flight Deals | Flighthelpbuddy",
    metaDescription:
      "Book international flights with expert assistance, compare multiple flight options, fares, and schedules, and get access to affordable international flight deals with 24/7 support.",
  },
},
{
  path: "ca/domestic-flights",
  loadComponent: () =>
    import("./pages/ca/domestic-flights/domestic-flights.component").then(
      (m) => m.DomesticFlightsComponent,
    ),
  title: "Find Domestic Flights at Great Fares | Flighthelpbuddy",
  data: {
    metaTitle: "Find Domestic Flights at Great Fares | Flighthelpbuddy",
    metaDescription:
      "Explore domestic flights, compare available fares and schedules, and find a flight that fits your travel plans.",
  },
},
{
  path: "ca/one-way-deals",
  loadComponent: () =>
    import("./pages/ca/one-way-deals/one-way-deals.component").then(
      (m) => m.OneWayDealsComponent,
    ),
  title: "One-Way Flights - Find Flights That Fit Your Plans | Flighthelpbuddy",
  data: {
    metaTitle:
      "One-Way Flights - Find Flights That Fit Your Plans | Flighthelpbuddy",
    metaDescription:
      "Looking for a one-way flight? Explore available routes, fares, and departure times to find an option that works for your trip.",
  },
},
{
  path: "ca/round-trip-deals",
  loadComponent: () =>
    import("./pages/ca/round-trip-deals/round-trip-deals.component").then(
      (m) => m.RoundTripDealsComponent,
    ),
  title: "Round Trip Flight Deals | Easy Booking & Great Fares",
  data: {
    metaTitle: "Round Trip Flight Deals | Easy Booking & Great Fares",
    metaDescription:
      "Find round trip flight deals with flexible travel options, competitive fares, easy booking, and 24/7 travel assistance.",
  },
},




{
  path: "flight-booking",
  loadComponent: () =>
    import("./pages/flight-booking/flight-booking.component").then(
      (m) => m.FlightBookingComponent,
    ),
  title: "Easy Flight Booking | Compare Flights & Book Online | Flighthelpbuddy",
  data: {
    metaTitle: "Easy Flight Booking | Compare Flights & Book Online | Flighthelpbuddy",
    metaDescription:
      "Book flights easily with flexible options, transparent pricing, expert guidance, and 24/7 customer support. Explore flight deals that fit your travel needs.",
  },
},

{
  path: "flight-ca",
  loadComponent: () =>
    import("./pages/flight-ca/flight-ca.component").then(
      (m) => m.FlightCaComponent,
    ),
  title: "Explore Flight Options | Easy & Flexible Travel | Flighthelpbuddy",
  data: {
    metaTitle: "Explore Flight Options | Easy & Flexible Travel | Flighthelpbuddy",
    metaDescription:
      "Explore different flight options, compare fares, and get flexible choices with transparent pricing and 24/7 support from travel experts.",
  },
},



{
  path: "flight-au",
  loadComponent: () =>
    import("./pages/flight-au/flight-au.component").then(
      (m) => m.FlightAuComponent,
    ),
  title: "Book Affordable Flights Online: Great Deals & Easy Booking | Flighthelpbuddy",
  data: {
    metaTitle: "Book Affordable Flights Online: Great Deals & Easy Booking | Flighthelpbuddy",
    metaDescription:
      "Find great flight deals for domestic and international travel. Compare fares, explore flexible booking options, and get expert assistance to plan your next trip.",
  },
},
{
  path: "ca/en-ca",
  loadComponent: () =>
    import("./pages/ca/en-ca/en-ca.component").then(
      (m) => m.EnCaComponent,
    ),
  title: "Find Affordable Flights Online: Great Fares & Easy Booking | Flighthelpbuddy",
  data: {
    metaTitle: "Find Affordable Flights Online: Great Fares & Easy Booking | Flighthelpbuddy",
    metaDescription:
      "Explore great flight deals for domestic and international journeys. Compare fares, review flexible options, and get expert assistance for a smoother booking.",
  },
},




{
  path: "en-usa",
  loadComponent: () =>
    import("./pages/en-usa/en-usa.component").then(
      (m) => m.EnUsaComponent,
    ),
  title: "Explore Flight Options & Deals | Easy Flight Search | Flighthelpbuddy",
  data: {
    metaTitle: "Explore Flight Options & Deals | Easy Flight Search | Flighthelpbuddy",
    metaDescription:
      "Explore different flight options, compare routes and fares, and get dedicated travel support for bookings, changes, cancellations, and more.",
  },
},
{
  path: "ca/flight-booking",
  loadComponent: () =>
    import("./pages/ca/flight-booking/flight-booking.component").then(
      (m) => m.FlightBookingComponent,
    ),
  title: "Flight Tickets Booking Online | Flighthelpbuddy",
  data: {
    metaTitle: "Flight Tickets Booking Online | Flighthelpbuddy",
    metaDescription:
      "Explore flights, compare available fares and schedules, and find a flight that fits your travel plans.",
  },
},
{
  path: "flight-uk",
  loadComponent: () =>
    import("./pages/flight-uk/flight-uk.component").then(
      (m) => m.FlightUkComponent,
    ),
  title: "Book Flights Online at Great Fares | Flighthelpbuddy",
  data: {
    metaTitle: "Book Flights Online at Great Fares | Flighthelpbuddy",
    metaDescription:
      "Find available flights, compare fares, and choose a schedule that fits your travel plans. Book your next flight with easy assistance.",
  },
},




    ],
  },

  // Auth and NotFound routes under BlankLayout
  {
    path: "",
    component: BlankLayoutComponent,
    children: [
      {
        path: "auth/login",
        loadComponent: () =>
          import("./pages/authentication/login/login.component").then(
            (m) => m.LoginComponent,
          ),
        title: "Login",
      },
      {
        path: "auth/register",
        loadComponent: () =>
          import("./pages/authentication/signup/signup.component").then(
            (m) => m.SignupComponent,
          ),
        title: "Register",
      },
      // {
      //   path: '**',
      //   loadComponent: () =>
      //     import('./pages/not-found/not-found.component').then(
      //       (m) => m.NotFoundComponent
      //     ),
      //   title: 'Not Found',
      // },
      {
        path: "**",
        redirectTo: "/",
        pathMatch: "full",
      },
    ],
  },
];
