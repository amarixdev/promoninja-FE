<p align = "center">
  <img width="200" alt="logo" src="public/assets/../../frontend/src/public/assets/logo.png">
</p>


# PromoNinja
Live Site: [promoninja.io
](https://promoninja.io)

**Note: For deployment purposes, the original project repository was split into this current client repo and the backend, which is available here: https://github.com/amarixdev/promoninja-BE**

PromoNinja is a free platform that brings together podcast creators, listeners, and sponsors. It simplifies sponsorship management for creators, provides exclusive promotions for listeners, and offers increased reach for sponsors. It's an all in one application for anyone who enjoys podcasts and saving money. 
## FAQ


#### Why did I build this?

Sponsor affiliate links are the most common way podcasts generate income. I noticed several podcasts had sponsors in common, so I came up with the idea to support multiple shows simultaneously. As a software developer and avid podcast listener, I felt happy to repay the podcasting community for the countless hours of entertainment.

## Features

### Search your favorite podcast or sponsor. 

![](public/../frontend/src/public/readme/features/search2.gif)

### **Responsive Layout, Mobile Optimized**

<span>
<img width="700" alt="desktop-podcast" src="public/../frontend/src/public/readme/ui/desktop-podcast.png">
<img width="190" alt="Mobile1" src="public/../frontend/src/public/readme/ui/mobile-podcast.png">
</span>

*Podcast Page* 

<span>
<img width="700" alt="desktop-offer" src="public/../frontend/src/public/readme/ui/desktop-offer.png">
<img width="180" alt="Mobile1" src="public/../frontend/src/public/readme/ui/mobile-offer.png">
</span>

*Offers Page*

### **Community Inputs**

![](public/../frontend/src/public/readme/features/reccomendations.gif)

**Reccomendations**: *Users can reccomend their favorite podcasts and sponsors to be added to the platform.* 

<img width="408" alt="report-issue" src="public/../frontend/src/public/readme/features/report-issue.png">

**Report Issue**: *Users can report broken affiliate links; this helps PromoNinja stay up-to-date* 

### **Pre-rendered Pages**
Pages are pre-rendered with GetStaticProps so that they are available immediately when the user visits it. This improves the performance of the app by reducing the number of requests that need to be made to the server.

**Other Features**
- Sponsor previews - *Desktop only*
- Load More pagination
- Easter Eggs
- Color-extracted UI

## Accessibility Considerations

_Visual - Ninja (Night) Mode_

<span align = "left">
<img width="240" alt="accessibility-light" src="public/../frontend/src/public/readme/ui/accessibility-light.png">
<img width="240" alt="accessibility-dark" src="public/../frontend/src/public/readme/ui/accessibility-dark.png">
</span>

 ___ 
 
_Visual - Screen Reader compatible_

_Cognitive - User-friendly navigation_

## Tech Stack
- Apollo GraphQL (client)
- NextJS + Typescript
- TailwindCSS
- Chakra UI

## Future Plans 
- Rebuild Chakra components with Tailwind and pure CSS 
- Add meta tags for improved searchability
- Add sub-categories to podcasts


# Custom Content-Management System

Explored different Headless CMS solutions, such as Sanity.io and Payload CMS, before deciding to create my own to better fit the needs of PromoNinja. The code is available to view here: **https://github.com/amarixdev/promoninja-CMS** 

## Key Features
### **Color Extractor**
![](public/../frontend/src/public/readme/cms/extraction.gif)

**Other Features**
- Spotify API integration
- Create Sponsors and Podcasts
- Delete Sponsors and Podcasts
- Update Categories
- Edit Promotions and Affiliate Links


## Tech Stack
- Apollo GraphQL (client)
- NextJS + Typescript
- TailwindCSS
- Chakra UI

## Future Plans
- Rebuild Chakra components with Tailwind and pure CSS
- Mobile optimization
- Refactor code base for readability

# Backend
Code: **https://github.com/amarixdev/promoninja-BE**

## Tech Stack
- Apollo GraphQL (server)
- NodeJS
- Prisma ORM
- MongoDB

## GraphQL API

### Queries
<img width="408" alt="queries" src="public/readme/../../frontend/src/public/readme/backend/query.png">

### Mutations
<img width="408" alt="mutations" src="public/readme/../../frontend/src/public/readme/backend/mutation.png">

### Podcast
<img width="200" alt="podcast" src="public/readme/../../frontend/src/public/readme/backend/podcast.png">

### Sponsor
<img width="200" alt="sponsor" src="public/readme/../../frontend/src/public/readme/backend/sponsor.png">

Full Schema available here: **https://github.com/amarixdev/promoninja-BE/blob/main/backend/src/graphql/typeDefs.ts**