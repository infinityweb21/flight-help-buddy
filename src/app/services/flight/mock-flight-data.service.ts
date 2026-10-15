import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MockFlightDataService {
  getFlightData(origin: string, destination: string): any {
    // For now, we ignore origin/destination, but you can extend this
    return {
      header: 'Find Cheap Flights from New York to Los Angeles',
      introParagraphs: [
        'Swap those subway rides with palm drives with our cheap New York to Los Angeles flights. Welcome to the City of Angels, where the film industry thrives, and you get to be a part of that culture for a few days. Infinity Travels makes your dreams come true by offering the best flights at competitive rates so you can enjoy the West Coast sun or seal a deal in Beverly Hills.',
        'With us, you’ll be introduced to some unbeatable deals you won’t find elsewhere. Plus, our 24/7 support, flexible ticket options, and one-on-one service will make the entire NYC to LAX flight booking stress-free. Booking at the last minute or months early? It doesn’t matter, as booking with us is simple and cost-efficient.',
      ],
      airlines: {
        heading: 'Airlines Flying from New York to Los Angeles',
        paragraph:
          'If you are after flexibility and total comfort on your New York (NYC) to Los Angeles (LAX) flight, then you’ll find many top US airlines offering nonstop as well as connecting flights between the two cities. It gives options to all kinds of travelers to book flights according to their budget and needs. So no matter whether you’re a business traveler or vacationer, you can find business class flight tickets and other fare classes, plus in-flight amenities, and frequent departures.',
        listHeading:
          'Top US Airlines Running Regular Flights from NYC to the L.A. Route:',
        list: [
          'American Airlines',
          'JetBlue',
          'United Airlines',
          'Delta Air Lines',
          'Alaska Airlines',
          'Southwest Airlines (via connections)',
        ],
      },
      flightDuration: {
        heading: 'Flight Duration & Distance',
        paragraph:
          'Wondering how long it will take on your New York to Los Angeles flight won’t help. You must be aware of the time taken on the flight so you can plan your day and itinerary better. Do you agree? It’ll take you 6 hours to get to L.A., but it could be longer due to factors like boarding and taxiing. Since it’s a domestic flight, you won’t have to bear the pain of customers and board your flight a bit quicker.',
        listHeading: 'Key Flight Info from NYC to L.A:',
        list: [
          'Average flight duration: 6 hours nonstop',
          'New York to Los Angeles distance: ~2,475 miles',
          'Nonstop and connecting flights are both available',
          'Take off from either JFK, EWR, or LGA to arrive at LAX',
        ],
      },
      bestTimeToBook: {
        heading: 'Best Time to Book a New York to Los Angeles Flight',
        paragraph:
          'The earlier you get your hands on a New York to Los Angeles flight ticket, the better it’ll be if you’re someone who wants to save big on their flights. Even though last-minute flight deals are present, they’re not guaranteed, and you might get stuck with higher prices. We don’t wish that for anyone, and therefore, recommend that you book an ideal duration.',
        listHeading: 'Timings to Book your L.A. Flight for Better Pricing:',
        list: [
          'You can find the best airfares for an L.A. flight some 1 to 3 months before',
          'Book in January or February for the cheapest fares',
          'Peak summer and holiday seasons are not great for saving',
          'Fare alerts and price tracking tools are really handy to track fare drops',
        ],
      },
      howToBook: {
        heading: 'How to book flights from New York to Los Angeles?',
        paragraph:
          'Don’t worry, unlike most flight booking platforms, Infinity Travels treats you with a quick, secure, and stress-free booking process. You can tell us if you want budget deals or luxury first class flight tickets, according to your travel needs, and we’ll help you find the right New York to Los Angeles flight - fast. If you need quick assistance, just give Infinity Travels a call at +1 (800) 645-3851 - we’re here to help 24/7.',
        listHeading: 'Simple Steps to Grab Your Coast-to-Coast Ticket:',
        list: [
          'Go to Infinity Travels’ flight search bar',
          'Enter your trip details like departure and arrival airports, dates, and number of travelers',
          'Instantly get a look at the top deals from various airlines',
          'You can filter by airline, price, duration, and class',
          'Click on View Deal and add baggage, insurance, hotels, and car rentals in one go',
          'Enter your passenger details and give your email to receive the booking',
          'Once done, pay for the flight at checkout, completely safe and secure',
          'Get instant confirmation via the email provided',
        ],
      },
      moneySavingTips: {
        heading: 'Tips to Find Cheap Flights from New York to Los Angeles',
        paragraph:
          'You need some sort of a strategy if you want to save money on your NYC to Los Angeles flights. Thankfully, we have just the tips for you, whether you’re flying solo or booking a group flight. Note these tips down so next time you’re about to book a flight, they’ll be readily available.',
        listHeading: 'Smart Ways to Find Cheap NYC–L.A. Flights:',
        list: [
          'Try flying midweek for cheaper flight prices',
          'Secure your flight early or get a red-eye flight at the last minute',
          'Analyze different airports to select the one with the cheapest fares',
          'Bundle your flight with accommodation and car rentals',
          'Sign up for fare alerts on our platform and catch fare drops',
          'Use your rewards or airline credit card points',
          'Clear cookies or use incognito when searching for flights',
          'Airlines offer last-minute first-class upgrades, so look out for them',
        ],
      },
      airports: {
        heading: 'Major Airports in New York & Los Angeles',
        paragraph:
          'As there are multiple departure and arrival points in both cities, you can choose whatever works for you. But when you’re booking New York to Los Angeles flights, airport, airline, and location must be kept in mind as they significantly affect the cost. NYC to LAX is a domestic route, but the airports also serve many international flights — perfect if you’re planning a vacation soon.',
        originHeading: 'NYC Airports:',
        originList: [
          'John F. Kennedy International (JFK)',
          'Newark Liberty International (EWR)',
          'LaGuardia Airport (LGA)',
        ],
        destinationHeading: 'Los Angeles Airports:',
        destinationList: [
          'Los Angeles International Airport (LAX)',
          'Hollywood Burbank Airport (BUR)',
          'Long Beach Airport (LGB)',
        ],
      },
      whyBook: {
        heading:
          'Why Book Your New York to Los Angeles Flight With Infinity Travels?',
        paragraph:
          'We make it super easy to book the best fare for your NY to Los Angeles flight — minus all the stress and overpaying. With a dedicated team working around the clock, Infinity Travels is all about smoother, more affordable experiences. That’s why our customers keep coming back!',
        listHeading: 'Here’s why booking with us makes a difference:',
        list: [
          {
            title: '24/7 Support',
            description: 'Call us anytime for help with bookings or changes.',
          },
          {
            title: 'Exclusive Deals',
            description:
              'Grab NYC to LAX offers available only through Infinity Travels.',
          },
          {
            title: 'Price Guarantee',
            description:
              'Found a lower price? We’ll match it — no hidden fees.',
          },
          {
            title: 'Custom Add-ons',
            description:
              'Easily include hotels, baggage, insurance, or cars in your itinerary.',
          },
          {
            title: 'Fare Alerts',
            description:
              'Be the first to know about fare drops and save instantly.',
          },
          {
            title: 'Flexible Changes',
            description:
              'Adjust your flight plans with ease, thanks to our flexible policies.',
          },
          {
            title: 'Secure Booking',
            description:
              'Safe, encrypted payments and reliable transactions from start to finish.',
          },
        ],
      },
      topRoutes: [
  'New York to Los Angeles',
  'Dallas to Los Angeles',
  'Denver to Los Angeles',
  'Honolulu to Los Angeles',
  'Las Vegas to Los Angeles',
  'Los Angeles to Dallas',
  'Los Angeles to Houston',
  'Los Angeles to New York',
  'Los Angeles to Seattle',
  'New York to Chicago',
  'New York to Fort Myers',
  'New York to Miami',
  'New York to Orlando',
  'Toronto to Los Angeles',
  'Los Angeles to Sydney Australia',
  'Los Angeles to San Diego',
  'Santiago to New York',
  'New York to Santiago',
  'New York to Santo Domingo',
  'Los Angeles to Auckland',
  'New York to London Heathrow',
  'Washington DC to New York',
  'New York to Rio de Janeiro',
  'Paris to New York',
  'Los Angeles to San Francisco',
  'Los Angeles to San Jose del Cabo',
  'Los Angeles to Puerto Vallarta',
  'Houston to Los Angeles',
  'New York to Paris',
  'New York to Rome',
],

      faqs: [
        {
          question: 'How much is a private flight from LA to New York?',
          answer:
            'A private New York to Los Angeles flight ticket price can cost you anywhere from $30,000 to $75,000 for one-way. The cost depends on many factors like aircraft types, number of passengers, and scheduling. Light jets are cheaper, though, while long-range ones cost a fortune.',
        },
        {
          question: 'What is the cheapest month to fly to Los Angeles?',
          answer:
            'For the cheapest flights, fly to L.A. in January. It’s post-holiday time, and travel is slow, so airlines offer competitive fares to fill their unsold seats. If you fly from New York to Los Angeles during this time, you’ll definitely enjoy milder weather and smaller crowds.',
        },
        {
          question: 'Which L.A. airport is the cheapest to fly into?',
          answer:
            'Los Angeles International (LAX) is the best airport to get cheap flights to. But if you’re headed to northern or eastern parts of L.A., then you’ve got to check out Long Beach or Burbank for convenience and better deals.',
        },
      ],
    };
  }
}
