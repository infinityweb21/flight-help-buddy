import { Injectable } from '@angular/core';
import { TravelPackage } from '../models/package.interface';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private packages: TravelPackage[] = [
    {
      slug: 'cycle-maine-acadia-national-park',
      pageTitle: 'Cycle Maine & Acadia National Park',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Cycle Maine & Acadia National Park',
          subtitle: 'Acadia National Park',
          backgroundImage: 'assets/images/about/banner1.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'There is much more to riding in Maine than the headline-grabbing untamed beauty of Acadia National Park',
          description:
            "Maine has much to offer cyclists of every skill level, from the coastal scenery that served as the inspiration for the ferocious seascape paintings of renowned American painter Winslow Homer in the 19th century to the classic New England fishing communities and lighthouses. The ideal remedy for bustling city life is to spend your days riding the peaceful and lovely tree-lined roads and your nights indulging in some of America's best seafood cuisine",
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['5 breakfasts'],
            },
            {
              category: 'Transport',
              items: [
                'Bicycle (e-bike option available, subject to availability)',
                'Support Vehicle',
              ],
            },
            {
              category: 'Accommodation',
              items: ['Simple Hotel/Motel (5 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.3386,-68.2733&hl=es&z=14&output=embed',
          coordinates: {
            latitude: 44.3386,
            longitude: -68.2733,
          },
          note: 'Updated coordinates for Acadia National Park, Maine',
        },
        itinerary: {
          title: 'Daily Itinerary',
          type: 'accordion',
          days: [
            {
              day: 1,
              title: 'Arrival in Bar Harbor',
              description:
                'Welcome to Maine! Arrive in the charming coastal town of Bar Harbor, gateway to Acadia National Park.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Acadia National Park Loop Road',
              description:
                'Cycle the famous Park Loop Road, taking in stunning coastal views and stopping at Thunder Hole and Otter Point.',
              expanded: true,
              details: {
                accommodation: ['Coastal Inn (1 night)'],
                includedActivities: ['Guided cycling tour of Park Loop Road'],
                mealsIncluded: ['Breakfast', 'Lunch'],
              },
            },
            {
              day: 3,
              title: 'Carriage Roads Adventure',
              description:
                'Explore the historic carriage roads built by John D. Rockefeller Jr., featuring beautiful stone bridges.',
              expanded: false,
            },
            {
              day: 4,
              title: 'Coastal Maine Discovery',
              description:
                'Cycle through picturesque fishing villages and enjoy fresh lobster by the sea.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Image 1',
          title: 'Title 1',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Image 2',
          title: 'Title 2',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Image 3',
          title: 'Title 3',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Image 4',
          title: 'Title 4',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Image 5',
          title: 'Title 5',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'zion-ranch-stay',
      pageTitle: 'Zion Ranch Stay Adventure',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Zion Ranch Stay Adventure',
          subtitle: 'Utah National Parks',
          backgroundImage: 'assets/images/packages/zion-ranch-stay/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title: "Experience the rugged beauty of Utah's red rock country",
          description:
            'Immerse yourself in the stunning landscapes of Zion National Park while staying at a authentic working ranch. This unique adventure combines outdoor activities with comfortable accommodations and genuine Western hospitality.',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['4 breakfasts', '3 lunches', '4 dinners'],
            },
            {
              category: 'Transport',
              items: ['Airport transfers', 'All ground transportation'],
            },
            {
              category: 'Accommodation',
              items: ['Ranch Lodge (4 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=37.297817,-113.028770&hl=es&z=14&output=embed',
          coordinates: {
            latitude: 37.297817,
            longitude: -113.02877,
          },
        },
        itinerary: {
          title: 'Daily Itinerary',
          type: 'accordion',
          days: [
            {
              day: 1,
              title: 'Las Vegas / Zion National Park',
              description:
                'Arrive in Las Vegas and transfer to Zion National Park area.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Zion and Bryce Canyon',
              description:
                "You'll be traveling to Bryce Canyon National Park for the day after breakfast this morning...",
              expanded: true,
              details: {
                accommodation: ['Ranch (1 night)'],
                includedActivities: ['Bryce Canyon - Leader-led Walk'],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Zion and Monument Valley',
              description: 'Explore the iconic landscapes of Monument Valley.',
              expanded: false,
            },
            {
              day: 4,
              title: 'Slot Canyon Peekaboo / Las Vegas',
              description:
                'Visit the famous slot canyons before returning to Las Vegas.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'yellowstone-and-grand-teton-adventure',
      pageTitle: 'Yellowstone & Grand Teton Adventure',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Yellowstone & Grand Teton Adventure',
          subtitle: "America's Premier National Parks",
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'Set off on a 6-day exploration of some of the most famous natural landmarks in the United States',
          description:
            'Visit Yellowstone, the oldest national park in the nation, where bison graze and Old Faithful spurts scorching water into the air. Follow along with a real-life wolf tracker who will teach you their top-secret tracking techniques as you search for animals including moose, bears, and beavers hiding inside the Grand Teton mountain range. Enjoy supper, cocktails, and entertainment in the renowned frontier town of Jackson, Wyoming, like the cowboys did in the evenings.',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['2 breakfasts', '1 dinners'],
            },
            {
              category: 'Transport',
              items: ['Private vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Hotel (5 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'Arrival in Jackson Hole',
              description:
                'Welcome to Jackson, Wyoming, a historic town previously populated by fur trappers and pioneers. Jackson serves as your entryway to Yellowstone National Park and is surrounded by imposing mountain ranges and the flowing Snake River. After our group meeting at 6 o`clock, we`ll enjoy a welcome meal. The remainder of the evening is yours to enjoy the town`s nightlife. You are welcome to stroll the plaza or perhaps have a drink at the renowned Million Dollar Cowboy Bar.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Grand Teton National Park',
              description:
                'Start your day of exploration of Grand Teton National Park, one of Wyoming`s most beautiful locations, after breakfast. Above a landscape filled with magnificent lakes and an abundance of animals, the Grand Teton mountain range rises. Take a journey to Inspiration Point for breathtaking vistas, or take a leisurely meander around Jenny Lake to take in the glacier-carved scenery. Enjoy a picnic, maybe see some moose or possibly a grizzly bear, and the tranquilly of this amazing location. Keep a watch out for elk, beavers, and black bears as well as other animals. Along the Gros Ventre River and Antelope Flats, there are viewing areas where you may see buffalo and antelope herds..',
              expanded: true,
              details: {
                accommodation: ['Mountain Lodge (1 night)'],
                includedActivities: [
                  'Jenny Lake boat tour',
                  'Wildlife viewing',
                ],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Yellowstone - Geysers and Hot Springs',
              description:
                'Visit Old Faithful and explore the Upper Geyser Basin.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'kentucky-bourbon-trail-nashville',
      pageTitle: 'Kentucky Bourbon Trail Nashville',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Kentucky Food Trail to Nashville',
          subtitle: 'A uplifting journey across Tennessee and Kentucky',
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title: 'A uplifting journey across Tennessee and Kentucky',
          description:
            'On a five-day excursion through the well-known Kentucky food and music route, experience the true flavour of the South. Beginning in the thriving metropolis of Louisville, learn about the progressive culinary culture, meet local farmers at a Shaker Village, and find out where foodies like to hang out. Before travelling south to Nashville, Tennessee, the home of country music, stop at a bourbon distillery to learn the ropes of the profession. You may feast on barbecue while getting a behind-the-scenes tour of the origins of country music, and of course, sip more bourbon!',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['4 breakfasts', '2 lunches', '1 dinners'],
            },
            {
              category: 'Transport',
              items: ['Private vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Hotel (4 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'Louisville',
              description:
                'Welcome to Jackson, Wyoming, a historic town previously populated by fur trappers and pioneers. Jackson serves as your entryway to Yellowstone National Park and is surrounded by imposing mountain ranges and the flowing Snake River. After our group meeting at 6 o`clock, we`ll enjoy a welcome meal. The remainder of the evening is yours to enjoy the town`s nightlife. You are welcome to stroll the plaza or perhaps have a drink at the renowned Million Dollar Cowboy Bar.',
              expanded: false,
              details: {
                accommodation: ['Hotel (1 night)'],
                includedActivities: [
                  'Louisville – Leader led Walking Tour',
                  'Louisville - Big Four Bridge Walk',
                  'Jeffersonville – NoCo Arts & Cultural District Walk',
                  'Louisville - Taste of Louisville Food Tour',
                ],
                mealsIncluded: ['Dinner'],
              },
            },
            {
              day: 2,
              title: 'Louisville',
              description:
                'Make your way to a historic village where the Kentucky Shakers lived between 1805 and 1910 after breakfast. Shaker life was known for being modest and quiet, and today the village offers tourists a fascinating look into this way of life. Arrive and meet a local guide for a tour of the hamlet. Discover how the society encouraged women since they shared authority and responsibility because they believed that men and women were created equally. Enjoy lunch at the on-site restaurant after that. Utilizing fresh materials cultivated in the village garden and following the Shaker`s sustainable agricultural methods, classic favourites and seasonal Kentucky recipes are prepared.',
              expanded: true,
              details: {
                accommodation: ['Hotel (1 night)'],
                includedActivities: [
                  'Jenny Lake boat tour',
                  'Wildlife viewing',
                ],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Nashville',
              description:
                'Leave Louisville behind and head south to a distillery that has been run by the same family since 1875! Open-pollinated white heirloom maize is used at the distillery, which is located in the heart of Kentucky`s bourbon region, to produce whiskey with a tad lighter flavour. Continue to Mammoth Cave National Park after your visit to see the world`s longest cave system, which spans more than 400 miles. You`ll discover an incredible subterranean environment filled with caves, natural cathedrals, and rock formations here. After spending some time exploring this unsettling environment, continue on to Nashville, Tennessee, the home of country music. The "honky tonks" of the city are well-known; these are lively taverns, clubs, and pubs that provide live music far into the night.Settling into your accommodation this evening will allow you to join the group for supper at a Nashville-style restaurant where line dancing is popular.',
              expanded: false,
              details: {
                accommodation: ['Hotel (1 night)'],
                includedActivities: [
                  'Bardstown - Distillery tour',
                  'Kentucky - Mammoth Cave National Park',
                  'Nashville - Wildhorse Saloon & line dancing',
                ],
                mealsIncluded: ['Breakfast'],
              },
            },
            {
              day: 4,
              title: 'Nashville',
              description:
                'This morning, after breakfast, take a tour of the city to learn more about Nashville`s hip and diverse neighbourhoods. Visit some of Nashville`s brightest and most picturesque murals, which include positive messages and city symbols and make for the ideal settings for some images to capture your vacation. You`ll also pause to get a doughnut from a nearby bakery; you`re in for a fantastic treat! Get hungry and learn more about Nashville`s culture with a barbecue and bourbon tour for lunch today. Learn about the history of some of the city`s most well-known restaurants and bars by visiting them. Try a tantalising selection of smoked meats combined with regional drinks and traditional side dishes.The Grand Ole Opry backstage tour will come next, the alleged birthplace of country music. You will get a behind-the-scenes glimpse at performances and follow in the stars of country music`s footsteps!',
              expanded: false,
              details: {
                accommodation: ['Hotel (1 night)'],
                includedActivities: [
                  'Nashville - Murals City Tour',
                  'Nashville - Bourbon & BBQ Lunch',
                  'Nashville – Backstage Tour of the Grand Ole Opry',
                ],
                mealsIncluded: ['Breakfast', 'Lunch'],
              },
            },
            {
              day: 5,
              title: 'Nashville',
              description:
                'There are no events scheduled for today. The hotel`s check-out time is at 10 am.',
              expanded: false,
              details: {
                accommodation: [],
                includedActivities: [],
                mealsIncluded: ['Breakfast'],
              },
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'new-york-city-boston-discovery',
      pageTitle: 'New York City to Boston Discovery',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'New England, New York, and new experiences',
          subtitle: "America's Premier National Parks",
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'New England, New York, and new experiences',
          description:
            `On this six-day state-spanning journey, discover what makes New York, Rhode Island, Cape Cod, and Boston some of the most popular tourist sites in the USA. Discover the old and modern sides of Boston, ride the picturesque canals of Providence, Rhode Island, step into the shoes of a New Yorker on a tour of Brooklyn's family-run shops and cafés, and let the beauty of Cape Cod's beaches and tiny villages wash over you. You won't want to leave the East Coast after you add wine tasting, picnics, and a tonne of kind people. who will teach you their top-secret tracking techniques as you search for animals including moose, bears, and beavers hiding inside the Grand Teton mountain range. Enjoy supper, cocktails, and entertainment in the renowned frontier town of Jackson, Wyoming, like the cowboys did in the evenings.`,
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['5 breakfasts', '2 lunches', '1 dinner'],
            },
            {
              category: 'Transport',
              items: ['Private vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Hotel (5 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'New York',
              description:
                'Greetings from New York, New York! A welcoming gathering at your hotel will kick off your trip down the East Coast at 9:30 this morning. Meet your local guide and the other adventurers who will be accompanying you, then go out to explore one of the most interesting cities in the world. Join a native New Yorker to explore Brooklyn, a borough renowned for its hip population, diverse dining options, and close-knit community. Brooklyn stands apart from the rest of New York due to the abundance of family-run "mom and pop" companies, many of which have been in operation for several generations.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Providence',
              description:
                `Before continuing on to Rhode Island, stop for lunch at a renowned neighborhood pizzeria in New Haven, Connecticut. Arrive at Providence, the state's capital and largest city, in the early afternoon. Climb onboard a riverboat and traverse the channels as your guide points out significant features, such Water place Park and the Providence River, while telling anecdotes about the city. This is the finest way to get to know this warm city. The remainder of the day is yours to explore more of the city's attractions after disembarking; the downtown area is ideal for wandering and is full of hip pubs and inventive restaurants.`,
              expanded: true,
              details: {
                accommodation: ['Hotel (1 night)'],
                includedActivities: [
                  'Providence–River Boat cruise',
                 
                ],
                mealsIncluded: ['Breakfast', 'Lunch'],
              },
            },
            {
              day: 3,
              title: 'Provincetown',
              description:
                `As you travel from Rhode Island to Massachusetts, make a stop at Chatham, a beautiful small town where you may stroll around its pleasant streets. Continue on to the Cape Cod National Seashore, a breath-taking coastline made up of marshes, uplands, and sandy beaches. Visit the Nauset Lighthouse, one of Cape Cod's most popular tourist destinations, to find out more about the work being made to preserve this significant piece of nautical history. Then it's time to move toward Cape Cod's northernmost point, where the town of Truro and a wonderful family-run winery are located. You may talk to one of the proprietors about the job they perform here while sampling five of the beautiful wines made at the vineyards. Continue on to Provincetown, which is close by and is the most northern town on Cape Cod. Here, you'll spend the night.`,
              expanded: false,
                details: {
                accommodation: ['Hotel (1 night)'],
                includedActivities: [
                'Cape Cod-Wine Tasting',
`Cape Cod-Cape Cod National Seashore`,
`Cape Cod-Nauset Lighthouse`
                 
                ],
                mealsIncluded: ['Breakfast'],
              },
            },
             {
              day: 4,
              title: 'Provincetown',
              description:
                `You have the day to learn more about Cape Cod. There is no shortage of fun to be enjoyed in this well-liked vacation spot for people from around the United States. You might like going on a tour with spiritual guide Anne Hutchison, who was expelled from her Puritan group. The drag queen incarnation of Anne, who passed almost 400 years ago, is still alive and puts on quite the show! Consider going for a stroll or a bike ride along the Cape Cod Rail Trail, going on a whale watching excursion, or getting some exercise by going kayaking. Visits to the Pilgrim Monument, JFK Museum, and Racepoint Lighthouse are all highly recommended. Your leader will be on hand to help you organize the ideal day here, no matter what your interests are. Late in the day, reunite for a sand dune tour to learn about Cape Cod's distinctive ecology. Finish at the beach and have a delectable clam bake meal while taking in one of the East Coast's most stunning sunsets.`,
              expanded: false,
                details: {
                accommodation: ['Cape Cod-Sunset clam bake dinner'],
                includedActivities: [
                'Provincetown - Art Association and Museum - USD12',
`Provincetown - Pilgrim Monument & Museum - USD25`,
`Provincetown - Racepoint Lighthouse - Free`
                 
                ],
                mealsIncluded: ['Breakfast','Dinner'],
              },
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'cycle-utah-bryce-zion-national-parks',
      pageTitle: 'Cycle Utah: Bryce & Zion National Parks',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Cycle Utah: Bryce & Zion National Parks',
          subtitle: "Wander across Utah's constantly shifting landscapes, canyons, woodlands, and deserts",
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'Set off on a 6-day exploration of some of the most famous natural landmarks in the United States',
          description:'',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['5 breakfasts'],
            },
            {
              category: 'Transport',
              items: ['Bicycle (e-bike option available, subject to availability), Support Vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Simple Hotel/Motel (5 nights)'],
            },
            {
              category: 'Included activities',
              items: ['Dixie National Forest',
                'Cedar Breaks National Monument',
                'Head of the Rocks Overlook',
                'Grand Staircase-Escalante National Monument',
                'Bryce Canyon National Park Cycling',
                'Zion National Park Cycling',
                'Snow Canyon State Park Cycling'

              ],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'Saint George',
              description:
                'The best getaway to some of Utah`s best parks and bike trails is Saint George. If you arrive early, you might choose to explore the neighbourhood on a leisurely morning or try one of the nearby hiking routes, including the Red Reef Trail. Your journey gets underway with a welcoming gathering with your guide and other travellers at 3 PM. After that, take a warm-up ride around Saint George, stopping to see famous landmarks like the 1877 St. George Temple`s exquisite architecture, before continuing on to the breathtaking Red Cliffs National Conservation Area and returning. It`s a short ride—only 23 kilometres (14 miles)—but it will give you a decent flavour of Utah`s breathtaking surroundings.After the trip, you are free to change and go out to one of the numerous restaurants in the lively downtown.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Grand Teton National Park',
              description:
                'Start your day of exploration of Grand Teton National Park, one of Wyoming`s most beautiful locations, after breakfast. Above a landscape filled with magnificent lakes and an abundance of animals, the Grand Teton mountain range rises. Take a journey to Inspiration Point for breathtaking vistas, or take a leisurely meander around Jenny Lake to take in the glacier-carved scenery. Enjoy a picnic, maybe see some moose or possibly a grizzly bear, and the tranquilly of this amazing location. Keep a watch out for elk, beavers, and black bears as well as other animals. Along the Gros Ventre River and Antelope Flats, there are viewing areas where you may see buffalo and antelope herds..',
              expanded: true,
              details: {
                accommodation: ['Mountain Lodge (1 night)'],
                includedActivities: [
                  'Jenny Lake boat tour',
                  'Wildlife viewing',
                ],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Yellowstone - Geysers and Hot Springs',
              description:
                'Visit Old Faithful and explore the Upper Geyser Basin.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'new-mexico-discovery',
      pageTitle: 'Kentucky Bourbon Trail Nashville',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Yellowstone & Grand Teton Adventure',
          subtitle: "America's Premier National Parks",
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'Set off on a 6-day exploration of some of the most famous natural landmarks in the United States',
          description:
            'Visit Yellowstone, the oldest national park in the nation, where bison graze and Old Faithful spurts scorching water into the air. Follow along with a real-life wolf tracker who will teach you their top-secret tracking techniques as you search for animals including moose, bears, and beavers hiding inside the Grand Teton mountain range. Enjoy supper, cocktails, and entertainment in the renowned frontier town of Jackson, Wyoming, like the cowboys did in the evenings.',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['2 breakfasts', '1 dinners'],
            },
            {
              category: 'Transport',
              items: ['Private vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Hotel (5 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'Arrival in Jackson Hole',
              description:
                'Welcome to Jackson, Wyoming, a historic town previously populated by fur trappers and pioneers. Jackson serves as your entryway to Yellowstone National Park and is surrounded by imposing mountain ranges and the flowing Snake River. After our group meeting at 6 o`clock, we`ll enjoy a welcome meal. The remainder of the evening is yours to enjoy the town`s nightlife. You are welcome to stroll the plaza or perhaps have a drink at the renowned Million Dollar Cowboy Bar.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Grand Teton National Park',
              description:
                'Start your day of exploration of Grand Teton National Park, one of Wyoming`s most beautiful locations, after breakfast. Above a landscape filled with magnificent lakes and an abundance of animals, the Grand Teton mountain range rises. Take a journey to Inspiration Point for breathtaking vistas, or take a leisurely meander around Jenny Lake to take in the glacier-carved scenery. Enjoy a picnic, maybe see some moose or possibly a grizzly bear, and the tranquilly of this amazing location. Keep a watch out for elk, beavers, and black bears as well as other animals. Along the Gros Ventre River and Antelope Flats, there are viewing areas where you may see buffalo and antelope herds..',
              expanded: true,
              details: {
                accommodation: ['Mountain Lodge (1 night)'],
                includedActivities: [
                  'Jenny Lake boat tour',
                  'Wildlife viewing',
                ],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Yellowstone - Geysers and Hot Springs',
              description:
                'Visit Old Faithful and explore the Upper Geyser Basin.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'hiking-moab',
      pageTitle: 'Kentucky Bourbon Trail Nashville',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Yellowstone & Grand Teton Adventure',
          subtitle: "America's Premier National Parks",
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'Set off on a 6-day exploration of some of the most famous natural landmarks in the United States',
          description:
            'Visit Yellowstone, the oldest national park in the nation, where bison graze and Old Faithful spurts scorching water into the air. Follow along with a real-life wolf tracker who will teach you their top-secret tracking techniques as you search for animals including moose, bears, and beavers hiding inside the Grand Teton mountain range. Enjoy supper, cocktails, and entertainment in the renowned frontier town of Jackson, Wyoming, like the cowboys did in the evenings.',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['2 breakfasts', '1 dinners'],
            },
            {
              category: 'Transport',
              items: ['Private vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Hotel (5 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'Arrival in Jackson Hole',
              description:
                'Welcome to Jackson, Wyoming, a historic town previously populated by fur trappers and pioneers. Jackson serves as your entryway to Yellowstone National Park and is surrounded by imposing mountain ranges and the flowing Snake River. After our group meeting at 6 o`clock, we`ll enjoy a welcome meal. The remainder of the evening is yours to enjoy the town`s nightlife. You are welcome to stroll the plaza or perhaps have a drink at the renowned Million Dollar Cowboy Bar.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Grand Teton National Park',
              description:
                'Start your day of exploration of Grand Teton National Park, one of Wyoming`s most beautiful locations, after breakfast. Above a landscape filled with magnificent lakes and an abundance of animals, the Grand Teton mountain range rises. Take a journey to Inspiration Point for breathtaking vistas, or take a leisurely meander around Jenny Lake to take in the glacier-carved scenery. Enjoy a picnic, maybe see some moose or possibly a grizzly bear, and the tranquilly of this amazing location. Keep a watch out for elk, beavers, and black bears as well as other animals. Along the Gros Ventre River and Antelope Flats, there are viewing areas where you may see buffalo and antelope herds..',
              expanded: true,
              details: {
                accommodation: ['Mountain Lodge (1 night)'],
                includedActivities: [
                  'Jenny Lake boat tour',
                  'Wildlife viewing',
                ],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Yellowstone - Geysers and Hot Springs',
              description:
                'Visit Old Faithful and explore the Upper Geyser Basin.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'cycle-sonoma-napa-valley',
      pageTitle: 'Kentucky Bourbon Trail Nashville',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Yellowstone & Grand Teton Adventure',
          subtitle: "America's Premier National Parks",
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'Set off on a 6-day exploration of some of the most famous natural landmarks in the United States',
          description:
            'Visit Yellowstone, the oldest national park in the nation, where bison graze and Old Faithful spurts scorching water into the air. Follow along with a real-life wolf tracker who will teach you their top-secret tracking techniques as you search for animals including moose, bears, and beavers hiding inside the Grand Teton mountain range. Enjoy supper, cocktails, and entertainment in the renowned frontier town of Jackson, Wyoming, like the cowboys did in the evenings.',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['2 breakfasts', '1 dinners'],
            },
            {
              category: 'Transport',
              items: ['Private vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Hotel (5 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'Arrival in Jackson Hole',
              description:
                'Welcome to Jackson, Wyoming, a historic town previously populated by fur trappers and pioneers. Jackson serves as your entryway to Yellowstone National Park and is surrounded by imposing mountain ranges and the flowing Snake River. After our group meeting at 6 o`clock, we`ll enjoy a welcome meal. The remainder of the evening is yours to enjoy the town`s nightlife. You are welcome to stroll the plaza or perhaps have a drink at the renowned Million Dollar Cowboy Bar.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Grand Teton National Park',
              description:
                'Start your day of exploration of Grand Teton National Park, one of Wyoming`s most beautiful locations, after breakfast. Above a landscape filled with magnificent lakes and an abundance of animals, the Grand Teton mountain range rises. Take a journey to Inspiration Point for breathtaking vistas, or take a leisurely meander around Jenny Lake to take in the glacier-carved scenery. Enjoy a picnic, maybe see some moose or possibly a grizzly bear, and the tranquilly of this amazing location. Keep a watch out for elk, beavers, and black bears as well as other animals. Along the Gros Ventre River and Antelope Flats, there are viewing areas where you may see buffalo and antelope herds..',
              expanded: true,
              details: {
                accommodation: ['Mountain Lodge (1 night)'],
                includedActivities: [
                  'Jenny Lake boat tour',
                  'Wildlife viewing',
                ],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Yellowstone - Geysers and Hot Springs',
              description:
                'Visit Old Faithful and explore the Upper Geyser Basin.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    {
      slug: 'western-usa-national-parks-loop',
      pageTitle: 'Kentucky Bourbon Trail Nashville',
      pageType: 'travel-package',
      sections: {
        banner: {
          title: 'Yellowstone & Grand Teton Adventure',
          subtitle: "America's Premier National Parks",
          backgroundImage: 'assets/images/packages/yellowstone/banner.webp',
          shapeImage: 'assets/images/Careers/shape8.png',
        },
        mainContent: {
          title:
            'Set off on a 6-day exploration of some of the most famous natural landmarks in the United States',
          description:
            'Visit Yellowstone, the oldest national park in the nation, where bison graze and Old Faithful spurts scorching water into the air. Follow along with a real-life wolf tracker who will teach you their top-secret tracking techniques as you search for animals including moose, bears, and beavers hiding inside the Grand Teton mountain range. Enjoy supper, cocktails, and entertainment in the renowned frontier town of Jackson, Wyoming, like the cowboys did in the evenings.',
        },
        inclusions: {
          title: 'Inclusions',
          categories: [
            {
              category: 'Meals',
              items: ['2 breakfasts', '1 dinners'],
            },
            {
              category: 'Transport',
              items: ['Private vehicle'],
            },
            {
              category: 'Accommodation',
              items: ['Hotel (5 nights)'],
            },
          ],
        },
        gallery: {
          title: 'Gallery',
          component: 'p-galleria',
          settings: {
            numVisible: 5,
            responsive: true,
            maxWidth: '100%',
          },
        },
        location: {
          title: 'LOCATION',
          mapUrl:
            'https://maps.google.com/maps?q=44.4280,-110.5885&hl=es&z=10&output=embed',
          coordinates: {
            latitude: 44.428,
            longitude: -110.5885,
          },
        },
        itinerary: {
          title: 'Jackson',
          type: 'Jackson',
          days: [
            {
              day: 1,
              title: 'Arrival in Jackson Hole',
              description:
                'Welcome to Jackson, Wyoming, a historic town previously populated by fur trappers and pioneers. Jackson serves as your entryway to Yellowstone National Park and is surrounded by imposing mountain ranges and the flowing Snake River. After our group meeting at 6 o`clock, we`ll enjoy a welcome meal. The remainder of the evening is yours to enjoy the town`s nightlife. You are welcome to stroll the plaza or perhaps have a drink at the renowned Million Dollar Cowboy Bar.',
              expanded: false,
            },
            {
              day: 2,
              title: 'Grand Teton National Park',
              description:
                'Start your day of exploration of Grand Teton National Park, one of Wyoming`s most beautiful locations, after breakfast. Above a landscape filled with magnificent lakes and an abundance of animals, the Grand Teton mountain range rises. Take a journey to Inspiration Point for breathtaking vistas, or take a leisurely meander around Jenny Lake to take in the glacier-carved scenery. Enjoy a picnic, maybe see some moose or possibly a grizzly bear, and the tranquilly of this amazing location. Keep a watch out for elk, beavers, and black bears as well as other animals. Along the Gros Ventre River and Antelope Flats, there are viewing areas where you may see buffalo and antelope herds..',
              expanded: true,
              details: {
                accommodation: ['Mountain Lodge (1 night)'],
                includedActivities: [
                  'Jenny Lake boat tour',
                  'Wildlife viewing',
                ],
                mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
              },
            },
            {
              day: 3,
              title: 'Yellowstone - Geysers and Hot Springs',
              description:
                'Visit Old Faithful and explore the Upper Geyser Basin.',
              expanded: false,
            },
          ],
        },
      },
      images: [
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
          alt: 'Zion National Park',
          title: 'Zion National Park',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
          alt: 'Ranch Stay',
          title: 'Authentic Ranch Experience',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
          alt: 'Bryce Canyon',
          title: 'Bryce Canyon Views',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
          alt: 'Monument Valley',
          title: 'Monument Valley',
        },
        {
          itemImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          thumbnailImageSrc:
            'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
          alt: 'Slot Canyon',
          title: 'Slot Canyon Adventure',
        },
      ],
      responsiveOptions: [
        {
          breakpoint: '1300px',
          numVisible: 4,
        },
        {
          breakpoint: '575px',
          numVisible: 1,
        },
      ],
    },
    // Add more packages here following the same structure
  ];

  constructor() {}

  /**
   * Get all packages
   */
  getAllPackages(): TravelPackage[] {
    return this.packages;
  }

  /**
   * Get package by slug
   */
  getPackageBySlug(slug: string): TravelPackage | undefined {
    return this.packages.find((pkg) => pkg.slug === slug);
  }

  /**
   * Get package slugs for routing
   */
  getPackageSlugs(): string[] {
    return this.packages.map((pkg) => pkg.slug);
  }

  /**
   * Add a new package
   */
  addPackage(packageData: TravelPackage): void {
    this.packages.push(packageData);
  }

  /**
   * Update existing package
   */
  updatePackage(slug: string, packageData: Partial<TravelPackage>): boolean {
    const index = this.packages.findIndex((pkg) => pkg.slug === slug);
    if (index !== -1) {
      this.packages[index] = { ...this.packages[index], ...packageData };
      return true;
    }
    return false;
  }

  /**
   * Helper method to create a package from JSON data like the one you provided
   */
  createPackageFromJson(jsonData: any, slug: string): TravelPackage {
    // Default responsive options
    const defaultResponsiveOptions = [
      {
        breakpoint: '1300px',
        numVisible: 4,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
      },
    ];

    // Default images (you can customize these)
    const defaultImages = [
      {
        itemImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
        thumbnailImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
        alt: 'Image 1',
        title: 'Title 1',
      },
      {
        itemImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
        thumbnailImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
        alt: 'Image 2',
        title: 'Title 2',
      },
      {
        itemImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
        thumbnailImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
        alt: 'Image 3',
        title: 'Title 3',
      },
      {
        itemImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
        thumbnailImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
        alt: 'Image 4',
        title: 'Title 4',
      },
      {
        itemImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
        thumbnailImageSrc:
          'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
        alt: 'Image 5',
        title: 'Title 5',
      },
    ];

    return {
      slug: slug,
      pageTitle: jsonData.pageTitle,
      pageType: jsonData.pageType,
      sections: jsonData.sections,
      images: defaultImages,
      responsiveOptions: defaultResponsiveOptions,
    };
  }

  /**
   * Add package from JSON data
   */
  addPackageFromJson(jsonData: any, slug: string): void {
    const packageData = this.createPackageFromJson(jsonData, slug);
    this.addPackage(packageData);
  }
}
