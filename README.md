# YesOrNo
A React social media app that allow users to create & vote on polls. User accounts handled with Firebase Auth, state management with Redux, & responsive styling with Tailwind CSS.<br/>
👉 [Live Demo](https://luk3v-yesorno.web.app/) 👈
👉 [Case Study](https://luke-v.com/yesorno-case-study/) 👈

## 💡 The Idea
I wanted to create a React project that would showcase my front-end knowledge by building something close to a real world product. I also wanted to learn Redux-Toolkit, Firebase Auth, & Tailwind CSS.

Instead of recreating an existing product, I decided to create my own. The idea was a React social media app where users can create profiles & post polls for people to vote on. To keep things simple I limited the options to "yes" or "no", hence the name "YesOrNo".

## ✒️ Designing it
After writing down the basic functionality. I drafted a quick design in Figma so I would have an idea of what I would need to build, how to structure my components, & how to style them.<br/>
![Design1](https://luke-v.com/images/yesorno-design1.png)
![Design2](https://luke-v.com/images/yesorno-design2.png)

## 🔨 Developing it
Planning: By far the most important tool was creating a person "Scrum Board", using Notion, for organizing & prioritizing which tasks to complete each day to move closer towards a minimum viable product.
![Todo](https://luke-v.com/images/Screenshot_5.png)

**Firebase Auth:** The first biggest challenge was handling user authentication. I used Redux-Toolkit for the state management & realized I would need to use middleware functions in order to asynchronously call the Firebase API before updating the state, so I used Redux-Toolkit's createAsyncThunk.

In a Firestore database, each authenticated user is created with a user doc with all their profile info, & a unique username doc linked to their uid. Their profile image is also hosted in the Firebase Cloud. A path routed to their profile page is created using their unique username.
![userThunks](https://luke-v.com/images/yesorno-googleauth.png)

**Debugging:** A somewhat silly roadblock was when debugging some issues with the React Router. I spent so much of time researching, making a bunch of tests, & even posting on Stack Overflow! I thought it was some obscure issue. But it ended up being just one line of code I forgot to change.

A lesson I learned was the importance of consistent testing of all modules, to easily track any breaking changes. And not to tunnel vision when debugging, because most likely its just a simple logic error.


**Poll Feeds:** In a separate Redux Slice, I set up handling for the poll feeds. However, some interaction with polls required updates to the user's profile database as well. One example is how voting adds the voter's uid in the poll doc & adds the pollID to the user doc, that way each user has all their votes stored.

In a similar way there is also a following feed, which updates & sorts all following accounts most recent polls. This requires the use of Firebase's query function.
![pollThunks](https://luke-v.com/images/yesorno-followingfeed.png)

‍**Styling:** Every good web app NEEDS a dark mode! Thanks to Tailwind-CSS I was able easily able to, as well as polish up the design more & make it mobile-first responsive.

