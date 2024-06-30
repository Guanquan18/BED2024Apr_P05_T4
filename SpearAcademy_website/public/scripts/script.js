/* 
Function Created
Sairam (S10255930H)
- showPopup(popupId)
- hidePopup(popupId)
- editSection
- ViewActive(containerId)
- fetchCoursesByCreator(containerId)
- fetchCourseandSectionDetails(CourseId)
- UpdateCourse()
- fetchSectionDetails

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
// Function for edit Section Pop-up (creator.html) Created by: Sairam
function editSection(CourseId, sectionNo) {
  // Show the edit popup
  showPopup('SectionDetails-Popup');
  // Log the section number
  console.log(`Editing Course: ${CourseId} Editing Section: ${sectionNo}`);
  fetchSectionDetails(CourseId, sectionNo)
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
              fetchCourseandSectionDetails(courseId);
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

// Function to fetch detailed information about a specific course and section. Created by: Sairam
let originalCourseDetails = {};
async function fetchCourseandSectionDetails(CourseId) {
  try {
    const response = await fetch(`http://localhost:3000/courses-with-sections-id/${CourseId}`);
    console.log("CourseId:", CourseId);
    console.log("Constructed URL:", response); // Log the constructed URL for debugging
    const data = await response.json();
    console.log("Data:", data);

    if (data.length === 0) {
      alert("No Courses found");
      return;
    }
    
    // Store original course details for comparison later
    originalCourseDetails = {
    CourseTitle: data[0].CourseTitle,
    SmallDescription: data[0].SmallDescription,
    Description: data[0].Description,
    Label: data[0].Label,
    Badge: data[0].Badge
  };

    // Update UI with fetched data
    const courseContainer = document.getElementById('Specific-course-container');
    courseContainer.querySelector('.top-content h1').innerText = data[0].CourseTitle; // Assuming data is an array with one course object
    courseContainer.querySelector('.course-title span').innerText = data[0].CourseTitle;
    courseContainer.querySelector('.course-label span').innerText = data[0].Label;
    courseContainer.querySelector('.course-small-description span').innerText = data[0].SmallDescription;
    courseContainer.querySelector('.course-badge span').innerText = data[0].Badge;
    courseContainer.querySelector('.course-last-updated span').innerText = data[0].LastUpdated;
    const courseImage = courseContainer.querySelector('.course-icon');
    courseImage.src = data[0].Thumbnail;
    courseImage.alt = data[0].CourseTitle;
    
    // Update description popup content
    const Description_Popup = document.getElementById('view-course-Description-Popup');
    Description_Popup.querySelector('.popup-content p').innerText = data[0].Description;

    // Pre-fill edit form
    document.getElementById('edit-Course-Title').value = data[0].CourseTitle;
    document.getElementById('edit-Course-SmallDescription').value = data[0].SmallDescription;
    document.getElementById('edit-Course-Description').value = data[0].Description;
    document.getElementById('edit-Course-Label').value = data[0].Label;
    document.getElementById('edit-Course-Badge').value = data[0].Badge;

    const pop_up_edit_container = document.querySelector('.popup-content');
    pop_up_edit_container.id = `edit-btn-${CourseId}`;

    // Dynamically create section items
    const sectionDetailsContainer = document.getElementById('section-details-container');
    sectionDetailsContainer.innerHTML = ''; // Clear existing content

    data[0].Sections.forEach((section, index) => {
      const sectionItem = document.createElement('div');
      sectionItem.classList.add('section-item', 'Tag', 'word-link');
      sectionItem.id = `section-item-${section.SectionNo}-${CourseId}`;

      sectionItem.innerHTML = `
          <h3>Section ${index + 1}: <span>${section.SectionTitle}</span></h3>
          <p id="edit-section-${section.SectionNo}-${CourseId}" onclick="editSection(${CourseId}, ${section.SectionNo})">Edit</p>
      `;

      sectionDetailsContainer.appendChild(sectionItem);
  });
    
  } catch (error) {
    console.error('Error fetching course details:', error);
    alert('Failed to fetch course details. Please try again later.');
  }
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
  // Check if the form inputs are updated. 
  const isChanged = JSON.stringify(updatedCourse) !== JSON.stringify(originalCourseDetails);

  if (!isChanged) {
    alert('Please update something before submitting.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/courses-id/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCourse)
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message && errorData.errors && errorData.errors.length > 0) {
        const validationErrors = errorData.errors.map(error => `- ${error}`).join('\n');
        throw new Error(`Validation Errors:\n${validationErrors}`);
      } else {
        throw new Error('Failed to update course'); // Fallback message if no specific message from server
      }
    }

    const data = await response.json();
    console.log(data);
    alert("Course details updated successfully!");
    hidePopup('edit-course-details-Popup');
    fetchCourseandSectionDetails(courseId); // Refresh displayed details after update
  } catch (error) {
    console.error('Error updating course:', error);
    alert(`${error.message}`);
  }
}


// Function to fetch sections by a specific course and sectionNo. Created by: Sairam
async function fetchSectionDetails(courseId, SectionNo) {
  const response = await fetch(`http://localhost:3000/sectionDetails-id/${courseId}/${SectionNo}`);
  const data = await response.json();
  console.log(data);
  if (data.length === 0) {
    alert("No Courses created");
  }
  const sectionDetailsPopUp = document.getElementById('SectionDetails-Popup');
  sectionDetailsPopUp.querySelector('.popup h2').innerText = data.SectionTitle;
}
