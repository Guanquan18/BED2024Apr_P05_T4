/* 
Function Created
Sairam (S10255930H)
- showPopup(popupId)
- hidePopup(popupId)
- ViewActive(containerId)
- fetchCoursesByCreator(containerId)
- fetchCourseDetails(CourseId)
- UpdateCourse()

Chang Guan Quan (S10257825A)
- 
-
-


Pey Zhi Xun (S10258774E)
- 
-
-

Keshwindren Gandipanh (S10259469C)
- 
-
-
*/


// Function to show a popup (creator.html) Created by: Sairam
function showPopup(popupId) {
  document.getElementById(popupId).style.display = 'block';
}

// Function to hide a popup (creator.html) Created by: Sairam
function hidePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

// Function to handle the "View" button click events and activate the specific course/community/profile view    Created by: Sairam
function ViewActive(containerId) {
  // Select all elements whose ID starts with 'view-btn' within the specified container
  const viewButtons = document.querySelectorAll(`.view-button`);

  // Add click event listener to each view button
  viewButtons.forEach(button => {
      button.addEventListener('click', () => {
          const courseId = button.id.split('-')[2];

          if (containerId === 'course-main-container') {
             // Activate course view
              const coursebtn = document.getElementById('courses-btn');
              coursebtn.classList.add('active');
              document.getElementById('courses-container').style.display = 'none';
              document.getElementById('Specific-course-container').style.display = 'block';
              fetchCourseDetails(courseId);
          } else if (containerId === 'community-main-container') {
            // Activate community view
            const coursebtn = document.getElementById('community-btn');
            coursebtn.classList.add('active');
            document.getElementById('community-container').style.display = 'none';
            document.getElementById('Specific-community-container').style.display = 'block';
          }
      });
  });
}

// Function to fetch courses created by a specific creator and display them. Created by: Sairam
async function fetchCoursesByCreator(containerId) {
  const courseList = document.getElementById(containerId);
  if (courseList) {
    // Proceed with fetching courses only if the container exists
    const creatorId = 1; // Example creator ID; modify as needed
    const response = await fetch(`http://localhost:3000/courses-creator/${creatorId}`);
    
    const data = await response.json();
    console.log(data);
    console.log(`Data fetched for container ${containerId}:`, data);
    if (data.length === 0) {
      alert("No Courses created");
    }
     // Clear the container
    courseList.innerHTML = ''; 
    
    const row = document.createElement('div');
    row.classList.add('row');
    // Iterate over each course in the data
    data.forEach((course) => {
      // Create a new div element for each column
      const col = document.createElement('div');
      col.classList.add('col-md-4');

      // Create a new div element for the card
      const card = document.createElement('div');
      card.classList.add('card');

      // Create an img element for the course thumbnail
      const img = document.createElement('img');
      img.src = course.Thumbnail;
      img.classList.add('card-img-top');
      img.alt = 'Course Image';
      
      // Create a div element for the card body
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      
      // Create a span element for the course label
      const label = document.createElement('span');
      label.classList.add('label');
      label.textContent = course.Label;
      
      // Create an h2 element for the course title
      const title = document.createElement('h2');
      title.classList.add('card-title');
      title.textContent = course.CourseTitle;
    
      // Create a p element for the course small description
      const description = document.createElement('p');
      description.classList.add('card-description');
      description.textContent = course.SmallDescription;
      
       // Create a div element for the card footer
      const cardFooter = document.createElement('div');
      cardFooter.classList.add('card-footer');
      
      // Create a p element for the course rating
      const rating = document.createElement('p');
      rating.innerHTML = `Rating: <span class="rating">${course.Ratings}</span>`;
    
      // Create a button element for the view button
      const viewButton = document.createElement('button');
      viewButton.classList.add(`view-button`);
      viewButton.classList.add(`view-button-${containerId}`);
      viewButton.id = `view-btn-${course.CourseId}`;
      viewButton.textContent = 'View';
    
       // Append label, title, and description to the card body
      cardBody.appendChild(label);
      cardBody.appendChild(title);
      cardBody.appendChild(description);
      
       // Append rating and view button to the card footer
      cardFooter.appendChild(rating);
      cardFooter.appendChild(viewButton);
      
      // Append img, card body, and card footer to the card
      card.appendChild(img);
      card.appendChild(cardBody);
      card.appendChild(cardFooter);
      
      // Append the card to the column
      col.appendChild(card);
      // Append the column to the row
      row.appendChild(col);
    });
    // Append the row to the container
    courseList.appendChild(row);
    // Initialize the view button event handlers
    ViewActive(containerId);
  }
}

// Function to fetch detailed information about a specific course. Created by: Sairam
async function fetchCourseDetails(CourseId) {
  const response = await fetch(`http://localhost:3000/courses-id/${CourseId}`);
  
  const data = await response.json();
  console.log(data)
  if (data.length == 0){
    alert("No Courses created");
  }
  // Update the specific course container with fetched data
  const courseContainer = document.getElementById('Specific-course-container');
  const Description_Popup = document.getElementById('view-course-Description-Popup');
  courseContainer.querySelector('.top-content h1').innerText = data.CourseTitle;
  courseContainer.querySelector('.course-title span').innerText = data.CourseTitle;
  courseContainer.querySelector('.course-label span').innerText = data.Label;
  courseContainer.querySelector('.course-small-description span').innerText = data.SmallDescription;
  courseContainer.querySelector('.course-badge span').innerText = data.Badge;
  courseContainer.querySelector('.course-last-updated span').innerText = data.LastUpdated;
  const courseImage = courseContainer.querySelector('.course-icon');
  courseImage.src = data.Thumbnail;
  courseImage.alt = data.CourseTitle;
  Description_Popup.querySelector('.popup-content p').innerText = data.Description;


  // Pre-fill form with fetched course details
  document.getElementById('edit-Course-Title').value = data.CourseTitle;
  document.getElementById('edit-Course-SmallDescription').value = data.SmallDescription;
  document.getElementById('edit-Course-Description').value = data.Description;
  document.getElementById('edit-Course-Label').value = data.Label;
  document.getElementById('edit-Course-Badge').value = data.Badge;

  const pop_up_edit_container = document.querySelector('.popup-content');
  pop_up_edit_container.id = `edit-btn-${CourseId}`
  }
// Function to update course details with the data from the form. Created by: Sairam
async function UpdateCourse() {
    const pop_up_edit_container = document.querySelector('.popup-content');
    const courseId = pop_up_edit_container.id.split('-')[2];

    const updatedCourse = {
      CourseTitle: document.getElementById('edit-Course-Title').value,
      SmallDescription: document.getElementById('edit-Course-SmallDescription').value,
      Description: document.getElementById('edit-Course-Description').value,
      Label: document.getElementById('edit-Course-Label').value,
      Badge: document.getElementById('edit-Course-Badge').value
    };

    // Send updated course details to server (example with fetch)
    try {
      const response = await fetch(`http://localhost:3000/courses-id/${courseId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedCourse)
      });

      if (!response.ok) {
          throw new Error('Failed to update course');
      }

      const data = await response.json();
      console.log(data)
      alert("Course details updated successfully!");
      hidePopup('edit-course-details-Popup');
      fetchCourseDetails(courseId); // Refresh displayed details after update
  } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again later.');
  }

  }

