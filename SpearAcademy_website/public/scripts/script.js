/* 
Function Created
Sairam (S10255930H)
- editSection
- viewActive(containerId)
- fetchAllCourses()
- fetchCoursesByCreator(containerId)
- fetchCourseandSectionDetails(CourseId)
- updateCourse()
- fetchSectionDetails()
- updateSectionDetails(0)
- updateCourseIcon()
- createNewCourse()
- createSectionDetails()
- deleteSectionDetails()
- deleteCourse()
Chang Guan Quan (S10257825A)
- 
-
-


Pey Zhi Xun (S10258774E)
- 
-
-

Keshwindren Gandipanh (S10259469C)
- fetchQnA(CourseId)
- fetchComments()
- postComments()
- deleteComment(commentId)
- updateComment(commentId, newText)
- editComment (commentId)
*/


const creatorId = JSON.parse(sessionStorage.getItem("accId")); // Retrieve the creator ID from the session storage
const token = sessionStorage.getItem("token"); // Retrieve the token from the session storage

// Function to handle the "View" button click events and activate the specific course/community/profile view    Created by: Sairam
async function viewActive(containerId) {
    // Select all elements whose ID starts with 'view-btn' within the specified container
    const viewButtons = document.querySelectorAll('.educator-course-view-button');
  
    // Add click event listener to each view button
    viewButtons.forEach(button => {
      button.addEventListener('click', async () => { // Make the event handler async
        const courseId = button.id.split('-')[2];
  
        if (containerId === 'educator-course-main-container') {
          // Activate course view
          const coursebtn = document.getElementById('courses-btn');
          coursebtn.classList.add('active');
          document.getElementById('educator-courses-container').style.display = 'none';
          document.getElementById('educator-specific-course-container').style.display = 'block';
          await fetchCourseandSectionDetails(courseId); // Await fetchCourseandSectionDetails
        } else if (containerId === 'educator-community-main-container') {
          // Activate community view
          const coursebtn = document.getElementById('community-btn');
          coursebtn.classList.add('active');
          document.getElementById('educator-community-container').style.display = 'none';
          document.getElementById('educator-specific-community-container').style.display = 'block';
  
          await fetchQnA(courseId); // Await fetchQnA to ensure it completes
          await fetchComments(); // Await fetchComments to ensure it runs after fetchQnA
        }
      });
    });
  }

// Function to fetch courses created by a specific creator and display them. Created by: Sairam
async function fetchCoursesByCreator(containerId) {
  const courseList = document.getElementById(containerId);
  if (courseList) {
    // Proceed with fetching courses only if the container exists
    const response = await fetch(`http://localhost:3000/courses-creator/${creatorId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

     // Check if the response status is 403 Forbidden
     if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to view these courses.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }

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
      card.classList.add('educator-course-card');

      // Create an img element for the course thumbnail
      const img = document.createElement('img');
      img.src = course.Thumbnail;
      img.classList.add('educator-course-card-img-top');
      img.alt = 'Course Image';
      
      // Create a div element for the card body
      const cardBody = document.createElement('div');
      cardBody.classList.add('educator-course-card-body');
      
      // Check if the label exists before creating the label element
      if (course.Label) {
        const label = document.createElement('span');
        label.classList.add('educator-course-label');
        label.textContent = course.Label;
        cardBody.appendChild(label); // Append label if it exists
      }
      
      // Create an h2 element for the course title
      const title = document.createElement('h2');
      title.classList.add('educator-course-card-title');
      title.textContent = course.CourseTitle;
    
      // Create a p element for the course small description
      const description = document.createElement('p');
      description.classList.add('educator-course-card-description');
      description.textContent = course.SmallDescription;
      
       // Create a div element for the card footer
      const cardFooter = document.createElement('div');
      cardFooter.classList.add('educator-course-card-footer');
      
      // Create a p element for the course rating
      const rating = document.createElement('p');
      rating.innerHTML = `Rating: <span class="rating">${course.Ratings}</span>`;
    
      // Create a button element for the view button
      const viewButton = document.createElement('button');
      viewButton.classList.add(`educator-course-view-button`);
      viewButton.classList.add(`educator-course-view-button-${containerId}`);
      viewButton.id = `view-btn-${course.CourseId}`;
      viewButton.textContent = 'View';
    
       // Append title, and description to the card body
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
    viewActive(containerId);
  }
}

// Function to fetch all courses  and display them. Created by: Sairam
async function fetchAllCourses() {
    courseList = document.getElementById("student-course-main-container")
    // Proceed with fetching courses only if the container exists
    const response = await fetch(`http://localhost:3000/courses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    
    const data = await response.json();
    if (data.length === 0) {
      alert("No Courses to be displayed");
    }
     // Clear the container
    courseList.innerHTML = ''; 
    
    const row = document.createElement('div');
    row.classList.add('row');
    // Iterate over each course in the data
    data.forEach((course) => {
      // Create a new div element for each column
      const col = document.createElement('div');
      col.classList.add('col-md-3');

      // Create a new div element for the card
      const card = document.createElement('div');
      card.classList.add('student-course-card');

      // Create an img element for the course thumbnail
      const img = document.createElement('img');
      img.src = course.Thumbnail;
      img.classList.add('student-course-card-img-top');
      img.alt = 'Course Image';
      
      // Create a div element for the card body
      const cardBody = document.createElement('div');
      cardBody.classList.add('student-course-card-body');
      
      // Check if the label exists before creating the label element
      if (course.Label) {
        const label = document.createElement('span');
        label.classList.add('student-course-label');
        label.textContent = course.Label;
        cardBody.appendChild(label); // Append label if it exists
        }
      
      // Create an h2 element for the course title
      const title = document.createElement('h2');
      title.classList.add('student-course-card-title');
      title.textContent = course.CourseTitle;
    
      // Create a p element for the course small description
      const description = document.createElement('p');
      description.classList.add('student-course-card-description');
      description.textContent = course.SmallDescription;

      // Create a p element for the course creator
      const fullname = document.createElement('p');
      fullname.classList.add('student-course-card-fullname');
      fullname.textContent = "Creator: " + course.Fullname;
      
       // Create a div element for the card footer
      const cardFooter = document.createElement('div');
      cardFooter.classList.add('student-course-card-footer');
      
      // Create a p element for the course rating
      const rating = document.createElement('p');
      rating.innerHTML = `Rating: <span class="rating">${course.Ratings}</span>`;
    
       // Append label, title, and description to the card body
      cardBody.appendChild(title);
      cardBody.appendChild(description);
      cardBody.appendChild(fullname);
      
       // Append rating and view button to the card footer
      cardFooter.appendChild(rating);
      
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
  }

// Function to fetch detailed information about a specific course and section. Created by: Sairam
let originalCourseDetails = {}; // Object to store original course details for comparison
async function fetchCourseandSectionDetails(CourseId) {
  try {
    const response = await fetch(`http://localhost:3000/courses-with-sections-id/${CourseId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            }
    });

     // Check if the response status is 403 Forbidden
     if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to view these courses and sections.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }

    console.log("CourseId:", CourseId);
    console.log("Constructed URL:", response); // Log the constructed URL for debugging
    const data = await response.json();
    console.log("Data:", data);
     // Handle the case where no course details are found   
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
    const courseContainer = document.getElementById('educator-specific-course-container');
    courseContainer.querySelector('.top-content h1').innerText = data[0].CourseTitle; // Assuming data is an array with one course object
    courseContainer.querySelector('.course-title span').innerText = data[0].CourseTitle;
    courseContainer.querySelector('.course-label span').innerText = data[0].Label;
    courseContainer.querySelector('.course-small-description span').innerText = data[0].SmallDescription;
    courseContainer.querySelector('.course-badge span').innerText = data[0].Badge;
    courseContainer.querySelector('.course-last-updated span').innerText = data[0].LastUpdated;
     // Update the course icon image
    const courseImage = courseContainer.querySelector('.course-icon');
    courseImage.src = data[0].Thumbnail; // Set course thumbnail
    courseImage.alt = data[0].CourseTitle; // Set alt text for accessibility
    
    // Update description popup content
    const Description_Popup = document.getElementById('view-course-Description-Popup');
    Description_Popup.querySelector('.popup-content p').innerText = data[0].Description;

    // Pre-fill edit form
    document.getElementById('edit-Course-Title').value = data[0].CourseTitle;
    document.getElementById('edit-Course-SmallDescription').value = data[0].SmallDescription;
    document.getElementById('edit-Course-Description').value = data[0].Description;
    document.getElementById('edit-Course-Label').value = data[0].Label;
    document.getElementById('edit-Course-Badge').value = data[0].Badge;

    // Set the ID for the popup edit container dynamically based on CourseId
    const pop_up_edit_container = document.querySelector('.popup-content');
    pop_up_edit_container.id = `edit-btn-${CourseId}`;

    // Dynamically create section items
    const sectionDetailsContainer = document.getElementById('section-details-container');
    sectionDetailsContainer.innerHTML = ''; // Clear existing content

    // Iterate over each section and create a new section item
    data[0].Sections.forEach((section, index) => {
      const sectionItem = document.createElement('div');
      sectionItem.classList.add('section-item', 'tag', 'word-link');
      sectionItem.id = `section-item-${section.SectionNo}-${CourseId}`;
        // Create the HTML content for each section item
      sectionItem.innerHTML = `
          <h3>
            Section ${index + 1}: <span>${section.SectionTitle}</span> <br> 
          </h3>
          <p id="edit-section-${section.SectionNo}-${CourseId} class = "edit-section-button" onclick="editSection(${CourseId}, ${section.SectionNo})">Edit</p>
      `;
        // Append the new section item to the section details container
      sectionDetailsContainer.appendChild(sectionItem);
  });
    
  } catch (error) {
    console.error('Error fetching course details:', error);
    alert('Failed to fetch course details. Please try again later.');
  }
}

// Function to update course details with the data from the form. Created by: Sairam
async function updateCourse() {
    // Get the course ID from the popup's ID attribute
  const pop_up_edit_container = document.querySelector('.popup-content');
  const courseId = pop_up_edit_container.id.split('-')[2];
    // Collect updated course details from the form inputs
  const updatedCourse = {
    CourseTitle: document.getElementById('edit-Course-Title').value,
    SmallDescription: document.getElementById('edit-Course-SmallDescription').value,
    Description: document.getElementById('edit-Course-Description').value,
    Label: document.getElementById('edit-Course-Label').value,
    Badge: document.getElementById('edit-Course-Badge').value
  };
  // Check if the form inputs are updated. 
  const isChanged = JSON.stringify(updatedCourse) !== JSON.stringify(originalCourseDetails);
  // Alert the user if no changes were made
  if (!isChanged) {
    alert('Please update something before submitting.');
    return;
  }

  try {
    // Send a PUT request to update the course details on the server
    const response = await fetch(`http://localhost:3000/courses-id/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
        'Authorization': `Bearer ${token}` // Include the token in the request headers
      },
      body: JSON.stringify(updatedCourse)  // Convert the updated course object to JSON for the request body
    });
     // Check if the response status is 403 Forbidden
     if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to update these courses.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }
    // Handle non-OK responses (errors)
    if (!response.ok) {
      const errorData = await response.json(); // Parse error response as JSON
      if (errorData.message && errorData.errors && errorData.errors.length > 0) {
         // Construct a detailed error message from server validation errors
        const validationErrors = errorData.errors.map(error => `- ${error}`).join('\n');
        throw new Error(`Validation Errors:\n${validationErrors}`);
      } else {
        throw new Error('Failed to update course'); // Fallback message if no specific message from server
      }
    }
    // Handle successful response
    const data = await response.json(); // Parse successful response as JSON
    console.log(data); // Log the response data for debugging
    alert("Course details updated successfully!"); // Notify user of successful update
    hidePopup('edit-course-details-Popup');
    fetchCourseandSectionDetails(courseId); // Refresh displayed details after update
  } catch (error) { 
    console.error('Error updating course:', error);
    alert(`${error.message}`);
  }
}

// Function for edit Section Pop-up (creator.html) Created by: Sairam
async function editSection(CourseId, sectionNo) {
  // Show the edit popup
  showPopup('sectionDetails-Popup');
  // Log the section number
  console.log(`Editing Course: ${CourseId} Editing Section: ${sectionNo}`);
  fetchSectionDetails(CourseId, sectionNo)
}

// Function to fetch sections by a specific course and sectionNo. Created by: Sairam
async function fetchSectionDetails(courseId, SectionNo) {
    // Fetch the section details from the server using the provided courseId and SectionNo
  const response = await fetch(`http://localhost:3000/sectionDetails-id/${courseId}/${SectionNo}`,{
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the request headers
        },
  });

   // Check if the response status is 403 Forbidden
   if (response.status === 403) {
    // Alert the user that only educators have permission to view these courses
    alert("Forbidden: Only educators have permissions to view section details.");
    // Redirect the user to the login page as they lack proper permissions
    window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
    return;
  }

 // Parse the response JSON data
  const data = await response.json();
  console.log(data);
   // Check if no data is returned and alert the user if so
  if (data.length === 0) {
    alert("No Courses created");
  }
  // Get the popup element where section details will be displayed
  const sectionDetailsPopUp = document.getElementById('sectionDetails-Popup');
  // Set the section title in the popup header
  sectionDetailsPopUp.querySelector('.popup-content h2').innerText = data.SectionTitle;
  
    const videoSourceElement = document.getElementById('video-source');  // For local videos
    const localVideoElement = document.getElementById('video-item');  // The video player element
    const youtubeVideoElement = document.getElementById('youtube-video'); // The YouTube iframe element

    if (data.Video.includes('youtube.com') || data.Video.includes('youtu.be')) {
         // Directly use the provided embed URL for the YouTube iframe
        youtubeVideoElement.src = data.Video;
         // Display the YouTube iframe and hide the local video player
        youtubeVideoElement.style.display = 'block';
        localVideoElement.style.display = 'none';
    } else {
        // Set the source for the local video element
        videoSourceElement.src = data.Video;
        // Reload the local video player to apply the new source
        localVideoElement.load();
          // Display the local video player and hide the YouTube iframe
        localVideoElement.style.display = 'block';
        youtubeVideoElement.style.display = 'none';
    }
  document.getElementById('section-title').value = data.SectionTitle; // Pre-fill the section title input field with the fetched section title
}

// Function to update course icon by a courseId. Created by: Sairam 
async function updateCourseIcon() {
    // Get the popup container and extract the course ID from its ID attribute
  const pop_up_edit_container = document.querySelector('.popup-content');
  const courseId = pop_up_edit_container.id.split('-')[2];
  // Get the file input element
  const fileInput = document.getElementById('course-icon');

  // Ensure a file is selected
  if (fileInput.files.length === 0) {
      alert('Please select a file to upload.');
      return;
  }

  // Create FormData object and append the selected file
  const formData = new FormData();
  formData.append('Thumbnail', fileInput.files[0]);

  try {
      // Send PUT request to update course icon
      const response = await fetch(`http://localhost:3000/courses-icon/${courseId}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}` // Include the token in the request headers
            },
          body: formData,
      });

       // Check if the response status is 403 Forbidden
       if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to update course icon.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }

      // Check if response is ok
      if (!response.ok) {
          const responseBody = await response.text();
          throw new Error('Failed to update course icon. Server responded with: ' + responseBody);
      }

      // If successful, show success message and update UI
      alert("Course icon updated successfully!");
      hidePopup('edit-course-icon-Popup');
      fetchCourseandSectionDetails(courseId); // Refresh displayed details after update
  } catch (error) {
      // Log and show error message if request fails
      console.error('Error updating course icon:', error);
      alert(`Error updating course icon: ${error.message}`);
  }
}
// Function to update section details by a courseId. Created by: Sairam 
async function updateSectionDetails() {
    // Select the section item button to retrieve section and course IDs
  const edit_section_btn = document.querySelector('.section-item');
  const sectionNo = edit_section_btn.id.split('-')[2];
  const courseId = edit_section_btn.id.split('-')[3];
    // Retrieve the new section title and the file input for the video
  const newSectionTitle = document.getElementById('section-title').value;
  const fileInput = document.getElementById('section-detail-video');

  // Check if either section title or video is updated
  if (newSectionTitle == "" && fileInput.files.length === 0) {
    alert('Please update either the section title or the section video before submitting.');
    return;
}


  // Create FormData object and append the selected file
  const formData = new FormData();
  if (fileInput.files.length > 0) {
      formData.append('Video', fileInput.files[0]);
  }
  formData.append('SectionTitle', newSectionTitle);

  try {
      // Send PUT request to update section details
      const response = await fetch(`http://localhost:3000/sectionDetails/${courseId}/${sectionNo}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}` // Include the token in the request headers
            },
          body: formData,
      });
       // Check if the response status is 403 Forbidden
       if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to update section details.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json(); // Parse response body as JSON

        if (errorData.message && errorData.errors && errorData.errors.length > 0) {
            const validationErrors = errorData.errors.map(error => `- ${error}`).join('\n');
            throw new Error(`Validation Errors:\n${validationErrors}`);
        } else {
            throw new Error('Failed to update section details'); // Fallback message if no specific message from server
        }
      }

      // If successful, show success message and update UI
      alert("Section details updated successfully!");
      fetchSectionDetails(courseId, sectionNo); // Refresh displayed details after update
      fetchCourseandSectionDetails(courseId); // Refresh displayed details after update
  } catch (error) {
      // Log and show error message if request fails
      console.error('Error updating section details:', error);
      alert(`Error updating section details: ${error.message}`);
  }
}

// Function to post course details . Created by: Sairam
async function createNewCourse() {
    // Retrieve values from form inputs
  const newTitle = document.getElementById('new-course-title').value;
  const newSmallDescription = document.getElementById('new-small-description').value;
  const newDescription = document.getElementById('new-description').value;
  const newLabel = document.getElementById('new-label').value;
  const newBadge = document.getElementById('new-badge').value;
  const fileInput = document.getElementById('new-course-thumbnail');

  // Check if any mandatory field is empty
  if (!newTitle || !newSmallDescription || !newDescription || !fileInput.files[0]) {
      alert('Please fill in all mandatory fields and select a thumbnail.');
      return;
  }

  // Create FormData object and append the selected file
  const formData = new FormData();
  formData.append('CourseTitle', newTitle);
  formData.append('SmallDescription', newSmallDescription);
  formData.append('Description', newDescription);
  formData.append('Thumbnail', fileInput.files[0]);
  formData.append('Label', newLabel);
  formData.append('Badge', newBadge);

  try {
      // Send POST request to create new course
      const response = await fetch(`http://localhost:3000/new-course/${creatorId}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}` // Include the token in the request headers
            },
          body: formData,
      });
       // Check if the response status is 403 Forbidden
       if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to create new courses.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }
      // Check if response is ok
      if (!response.ok) {
          const errorData = await response.json(); // Parse response body as JSON

          if (errorData.message && errorData.errors && errorData.errors.length > 0) {
              const validationErrors = errorData.errors.map(error => `- ${error}`).join('\n');
              throw new Error(`Validation Errors:\n${validationErrors}`);
          } else {
              throw new Error('Failed to create course'); // Fallback message if no specific message from server
          }
      }

      // If successful, show success message and update UI
      alert("Course created successfully!");
      hidePopup('newCoursePopup');
      document.getElementById('new-course-form').reset();
      fileInput.value = '';
      fetchCoursesByCreator('educator-course-main-container')
  } catch (error) {
      // Log and show error message if request fails
      console.error('Error creating course:', error);
      alert(`Error creating course: ${error.message}`);
  }
}

// Function to create section details by a courseId. Created by: Sairam 
async function createSectionDetails() {
     // Retrieve the course ID from the popup container's ID
  const pop_up_edit_container = document.querySelector('.popup-content');
  const courseId = pop_up_edit_container.id.split('-')[2];
    // Retrieve values from form inputs
  const newSectionTitle = document.getElementById('new-section-title').value;
  const newvideofileInput = document.getElementById('new-section-detail-video');

  // Check if either section title or video is updated
  if (newSectionTitle == "" ||  newvideofileInput.files.length === 0) {
    alert('Please update both the section title or the section video before submitting.');
    return;
}


  // Create FormData object and append the selected file
  const formData = new FormData();
  if (newvideofileInput.files.length > 0) {
      formData.append('Video', newvideofileInput.files[0]);
  }
  formData.append('SectionTitle', newSectionTitle);

  try {
      // Send PUT request to update section details
      const response = await fetch(`http://localhost:3000/new-sectionDetails/${courseId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request headers
          },
          body: formData,
      });
       // Check if the response status is 403 Forbidden
       if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to create new sections.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json(); // Parse response body as JSON

        if (errorData.message && errorData.errors && errorData.errors.length > 0) {
            const validationErrors = errorData.errors.map(error => `- ${error}`).join('\n');
            throw new Error(`Validation Errors:\n${validationErrors}`);
        } else {
            throw new Error('Failed to update section details'); // Fallback message if no specific message from server
        }
      }

      // If successful, show success message and update UI
      alert("Section details updated successfully!");
      hidePopup('newSection-Pop-Up');
        // Reset the form
        document.getElementById('create-section-detail-form').reset();
        
        // Clear the file input
        newvideofileInput.value = '';
      fetchCourseandSectionDetails(courseId); // Refresh displayed details after update
  } catch (error) {
      // Log and show error message if request fails
      console.error('Error updating section details:', error);
      alert(`Error updating section details: ${error.message}`);
  }
}

// Function to delete section details by a courseId. Created by: Sairam 
async function deleteSectionDetails() {
    // Retrieve the section item element and extract section number and course ID from its ID
  const edit_section_btn = document.querySelector('.section-item');
  const sectionNo = edit_section_btn.id.split('-')[2]; // Extract section number from the element's ID
  const courseId = edit_section_btn.id.split('-')[3];

  try {
    // Send DELETE request to the server to remove the section
    const response = await fetch(`http://localhost:3000/delete-sectionDetails/${sectionNo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the request headers
      },
    });
     // Check if the response status is 403 Forbidden
     if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to delete these sections.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }
     // Check if the response indicates success
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
     // Notify user of success and update UI
    alert("Section details delete successfully!");
      hidePopup('section-confirmation-pop-up');  // Hide confirmation popup
      hidePopup('sectionDetails-Popup');  // Hide section details popup
      fetchCourseandSectionDetails(courseId); // Refresh displayed details after update
  } catch (error) {
    console.error('Error deleting section details:', error);
    // Handle error as needed (e.g., show error message to user)
  }
}

// Function to delete course details by a courseId. Created by: Sairam 
async function deleteCourse() {
    // Retrieve the course ID from the popup container's ID
  const pop_up_edit_container = document.querySelector('.popup-content');
  const courseId = pop_up_edit_container.id.split('-')[2];
  try {
    // Send DELETE request to the server to remove the course
    const response = await fetch(`http://localhost:3000/delete-course/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the request headers
      },
    });
     // Check if the response status is 403 Forbidden
     if (response.status === 403) {
        // Alert the user that only educators have permission to view these courses
        alert("Forbidden: Only educators have permissions to delete these courses.");
        // Redirect the user to the login page as they lack proper permissions
        window.location.href = '../login-signup-pages/login.html'; // Adjust the path if needed
        return;
      }
    // Check if the response indicates success
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Course details delete successfully!");
      hidePopup('course-confirmation-pop-up');  // Hide confirmation popup
      hidePopup('sectionDetails-Popup');  // Hide section details popup
      fetchCoursesByCreator('educator-course-main-container'); // Refresh displayed details after update
      document.getElementById('educator-courses-container').style.display = 'block'; // Show courses container
      document.getElementById('educator-specific-course-container').style.display = 'none'; // Hide specific course container
  } catch (error) {
    console.error('Error course section details:', error);
    // Handle error as needed (e.g., show error message to user)
  }
}



// Function to retrieve QnA details by a courseId. Created by: Keshwindren 
async function fetchQnA(CourseId) {
    try {
      const response = await fetch(`http://localhost:3000/QnA/${CourseId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("QnA Data:", data);
  
      // Handle the case where no QnA details are found
      if (data.length === 0) {
        alert("No QnA entries found for this course");
        return;
      }
  
      const qnaTitle = document.getElementById('qna-title');
      const qnaPostDate = document.getElementById('qna-postdate');
      const boxContainer = document.querySelector('.box-container');
  
      qnaTitle.innerText = data[0].QnAtitle;
      qnaPostDate.innerText = "Created On: " + new Date(data[0].QnApostDate).toLocaleDateString();
  
      // Set the id attribute for the box-container element based on QnAId
      boxContainer.id = `box-container-${data[0].id}`;
      console.log(boxContainer.id)
    } catch (error) {
      console.error('Error fetching QnA details:', error);
      alert('Failed to fetch QnA details. Please try again later.');
    }
  }
// Function to retrieve comments details. Created by: Keshwindren 
async function fetchComments() {
    try {
        // Get the box-container element
        const boxContainer = document.querySelector('.box-container');
        const qnaId = boxContainer.id.split('-')[2]; 
        const response = await fetch(`http://localhost:3000/comments-QnA/${qnaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        }
        );
        
        // Handle non-JSON responses (e.g., HTML error page)
        if (!response.ok) {
            const text = await response.text();
            console.error("Error fetching comments:", text);
            return;
        }
        
        const comments = await response.json();
        const commentsSection = document.getElementById("comments-section");

        // Clear existing comments
        commentsSection.innerHTML = '';

        comments.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("post");

            // Determine the name to display
            let displayName;
            if (comment.messageAccount === creatorId) {
                displayName = "You";
            } else {
                displayName = comment.fullName;
            }
            commentDiv.innerHTML = `
                <p><strong>${displayName}</strong> - ${new Date(comment.msgDate).toLocaleString()}</p>
                <p>${comment.msgText}</p>
            `;
            commentsSection.appendChild(commentDiv);
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

// Function to retrieve post comments. Created by: Keshwindren  
async function postComment() {
    const commentInput = document.getElementById("comment-input");
    const msgText = commentInput.value;

    if (msgText.trim() !== "") {
        try {
            // Get the QnA ID from the box-container element 
            const boxContainer = document.querySelector('.box-container');
            const qnaId = boxContainer.id.split('-')[2]; 

            const accountId = creatorId;  
            const response = await fetch("/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include the token in the request headers
                },
                body: JSON.stringify({
                    msgText,
                    messageAccount: accountId,
                    messageQnA: qnaId
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const newComment = await response.json();
            const commentsSection = document.getElementById("comments-section");
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("post");
            commentDiv.id = `comment-${newComment.id}`; // addition of the comment ID to the div
            commentDiv.innerHTML = `
                <p><strong>You</strong> - <span class="comment-date">${new Date(newComment.msgDate).toLocaleString()}</span></p>
                <p class="comment-text">${newComment.msgText}</p> 
                <button onclick="deleteComment(${newComment.id})">Delete</button> 
                <button onclick="editComment(${newComment.id})">Edit</button>

            `; // having the delete button appear after posting comments
            // having the edit button appear after posting comments
            commentsSection.appendChild(commentDiv);
            commentInput.value = "";
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    }
}

// Function to delete comment. Created by : Keshwindren 
async function deleteComment(commentId) {
    try {
        // Send a DELETE request to the server
        const response = await fetch(`/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include the token in the request headers
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // Remove the comment element from the DOM
        const commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
            commentElement.remove();
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}

// Function to update posted comments. Created by : Keshwindren 
async function updateComment(commentId, newText) {
    try {
        const response = await fetch(`/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            },
            body: JSON.stringify({ msgText: newText })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const updatedComment = await response.json(); 

        const commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
            const commentTextElement = commentElement.querySelector('.comment-text'); 
            const commentDateElement = commentElement.querySelector('.comment-date'); 
            commentTextElement.textContent = newText;
            commentDateElement.textContent = new Date(updatedComment.msgDate).toLocaleString(); 
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
}

// Continuation of the update feature. Created by : Keshwindren     
function editComment(commentId) {
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (!commentElement) {
        console.error(`Comment element with ID comment-${commentId} not found`);
        return;
    }
    const commentTextElement = commentElement.querySelector('.comment-text');
    if (!commentTextElement) {
        console.error(`Comment text element with class .comment-text not found in comment-${commentId}`);
        return;
    }
    const currentText = commentTextElement.textContent;

    // Ceate input field with the current comment text
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;
    inputField.classList.add('edit-input');

    // Create a save button to save the edited comment
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = function() {
        const newText = inputField.value;
        updateComment(commentId, newText).then(() => {
            commentTextElement.textContent = newText;
            commentElement.removeChild(inputField);
            commentElement.removeChild(saveButton);
        });
    };

    // Add the input field and save button to the comment element
    commentElement.appendChild(inputField);
    commentElement.appendChild(saveButton);
}


// Functions created by: Pey Zhi Xun
let currentQuizId = null;
let quizData = [];
let userAnswers = [];
let score = 0;
let currentQuestionIndex = 0;

let newQuizData = {
    QuizTitle: '',
    Section_Quiz: '',
    Course_Quiz: '',
    questions: [
        {
            QuestionTitle: '',
            options: []
        }
    ]
};

let currentOptionIndex = 0;
let currentQuestionBlockIndex = 1;

let currentEditQuestionIndex = 0;
let currentEditOptionIndex = 0;

async function openEditForm(quizId, currentTitle) {
    currentQuizId = quizId;
    const editQuizTitleInput = document.getElementById('edit-quiz-title');
    const editQuizForm = document.getElementById('edit-quiz-form');
    const editQuestionContainer = document.getElementById('edit-question-container');
    
    try {
        const response = await fetch(`/api/quizzes/${quizId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        if (!response.ok) throw new Error('Failed to fetch quiz details');
        const quizData = await response.json();

        // Store the current section ID
        currentSectionId = quizData.questions.length > 0 ? quizData.questions[0].Section_Question : null;

        editQuizTitleInput.value = currentTitle;
        editQuizForm.style.display = 'block';

        editQuestionContainer.innerHTML = '';
        quizData.questions.forEach((question, qIndex) => {
            const questionBlock = document.createElement('div');
            questionBlock.id = `edit-question-block-${qIndex + 1}`;
            questionBlock.className = 'edit-question-block';
            questionBlock.style.display = qIndex === 0 ? 'block' : 'none';
            questionBlock.innerHTML = `
                <label for="edit-question-${qIndex + 1}">Question ${qIndex + 1}:</label>
                <input type="text" id="edit-question-${qIndex + 1}" value="${question.QuestionTitle}">
            `;

            question.options.forEach((option, oIndex) => {
                const optionBlock = document.createElement('div');
                optionBlock.id = `edit-option-${oIndex + 1}-container-${qIndex + 1}`;
                optionBlock.className = 'option-container';
                optionBlock.style.display = oIndex === 0 ? 'block' : 'none';
                optionBlock.innerHTML = `
                    <label for="edit-option-${oIndex + 1}-${qIndex + 1}">Option ${oIndex + 1}:</label>
                    <input type="text" id="edit-option-${oIndex + 1}-${qIndex + 1}" value="${option.OptionName}">
                    <label for="edit-explanation-${oIndex + 1}-${qIndex + 1}">Explanation ${oIndex + 1}:</label>
                    <input type="text" id="edit-explanation-${oIndex + 1}-${qIndex + 1}" value="${option.Explanation}">
                    <label for="edit-correct-answer-${oIndex + 1}-${qIndex + 1}">Correct Answer:</label>
                    <input type="radio" id="edit-correct-answer-${oIndex + 1}-${qIndex + 1}" name="edit-correct-answer-${qIndex + 1}" value="${oIndex + 1}" ${option.IsCorrectOption ? 'checked' : ''}>
                `;
                questionBlock.appendChild(optionBlock);
            });

            editQuestionContainer.appendChild(questionBlock);
        });

        // Add navigation buttons for options and questions
        const navigationButtons = document.createElement('div');
        navigationButtons.id = 'navigation-buttons';
        navigationButtons.innerHTML = `
            <button id="edit-prev-question-button" style="display: none;">Previous Question</button>
            <button id="edit-next-question-button">Next Question</button>
            <button id="edit-prev-option-button" style="display: none;">Previous Option</button>
            <button id="edit-next-option-button">Next Option</button>
        `;
        editQuestionContainer.appendChild(navigationButtons);

        // Initialize indexes
        currentEditQuestionIndex = 0;
        currentEditOptionIndex = 0;
        updateEditOptionNavigationButtons();
        updateEditQuestionNavigationButtons();

        // Attach event listeners
        document.getElementById('edit-next-option-button').addEventListener('click', handleNextOptionEdit);
        document.getElementById('edit-prev-option-button').addEventListener('click', handlePrevOptionEdit);
        document.getElementById('edit-next-question-button').addEventListener('click', handleNextQuestionEdit);
        document.getElementById('edit-prev-question-button').addEventListener('click', handlePrevQuestionEdit);

    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

function handleNextOptionEdit() {
    const currentQuestionIndex = currentEditQuestionIndex;
    const activeOption = document.querySelector(`#edit-option-${currentEditOptionIndex + 1}-container-${currentQuestionIndex + 1}`);
    if (activeOption && activeOption.nextElementSibling && activeOption.nextElementSibling.classList.contains('option-container')) {
        activeOption.style.display = 'none';
        activeOption.nextElementSibling.style.display = 'block';
        currentEditOptionIndex++;
    }
    updateEditOptionNavigationButtons();
}

function handlePrevOptionEdit() {
    const currentQuestionIndex = currentEditQuestionIndex;
    const activeOption = document.querySelector(`#edit-option-${currentEditOptionIndex + 1}-container-${currentQuestionIndex + 1}`);
    if (activeOption && activeOption.previousElementSibling && activeOption.previousElementSibling.classList.contains('option-container')) {
        activeOption.style.display = 'none';
        activeOption.previousElementSibling.style.display = 'block';
        currentEditOptionIndex--;
    }
    updateEditOptionNavigationButtons();
}

function handleNextQuestionEdit() {
    const activeQuestion = document.querySelector(`#edit-question-block-${currentEditQuestionIndex + 1}`);
    if (activeQuestion && activeQuestion.nextElementSibling && activeQuestion.nextElementSibling.classList.contains('edit-question-block')) {
        activeQuestion.style.display = 'none';
        activeQuestion.nextElementSibling.style.display = 'block';
        currentEditQuestionIndex++;
        currentEditOptionIndex = 0; // Reset option index for the new question
        updateEditOptionNavigationButtons();
        updateEditQuestionNavigationButtons();
    }
}

function handlePrevQuestionEdit() {
    const activeQuestion = document.querySelector(`#edit-question-block-${currentEditQuestionIndex + 1}`);
    if (activeQuestion && activeQuestion.previousElementSibling && activeQuestion.previousElementSibling.classList.contains('edit-question-block')) {
        activeQuestion.style.display = 'none';
        activeQuestion.previousElementSibling.style.display = 'block';
        currentEditQuestionIndex--;
        currentEditOptionIndex = 0; // Reset option index for the new question
        updateEditOptionNavigationButtons();
        updateEditQuestionNavigationButtons();
    }
}

function updateEditOptionNavigationButtons() {
    const currentQuestionIndex = currentEditQuestionIndex;
    const totalOptions = document.querySelectorAll(`#edit-question-block-${currentQuestionIndex + 1} .option-container`).length;

    document.getElementById('edit-prev-option-button').style.display = currentEditOptionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('edit-next-option-button').style.display = currentEditOptionIndex < totalOptions - 1 ? 'inline-block' : 'none';
}

function updateEditQuestionNavigationButtons() {
    const totalQuestions = document.querySelectorAll('.edit-question-block').length;

    document.getElementById('edit-prev-question-button').style.display = currentEditQuestionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('edit-next-question-button').style.display = currentEditQuestionIndex < totalQuestions - 1 ? 'inline-block' : 'none';
}

document.getElementById('save-quiz-button').addEventListener('click', async () => {
  const newTitle = document.getElementById('edit-quiz-title').value;
  const questions = Array.from(document.querySelectorAll('.edit-question-block')).map((block, questionIndex) => {
      const questionTitle = document.getElementById(`edit-question-${questionIndex + 1}`).value;
      const options = [];

      for (let oIndex = 1; oIndex <= 4; oIndex++) {
          const optionNameElement = document.getElementById(`edit-option-${oIndex}-${questionIndex + 1}`);
          const explanationElement = document.getElementById(`edit-explanation-${oIndex}-${questionIndex + 1}`);
          const correctAnswerElement = document.getElementById(`edit-correct-answer-${oIndex}-${questionIndex + 1}`);

          if (optionNameElement && explanationElement && correctAnswerElement) {
              const optionName = optionNameElement.value;
              const explanation = explanationElement.value;
              const isCorrect = correctAnswerElement.checked;

              options.push({
                  OptionName: optionName,
                  Explanation: explanation,
                  IsCorrectOption: isCorrect
              });
          }
      }

      return {
          QuestionTitle: questionTitle,
          Section_Question: currentSectionId,  // Ensure this field is set
          options: options
      };
  });

  const payload = {
      QuizTitle: newTitle,
      questions: questions
  };


  try {
      const response = await fetch(`/api/quizzes/${currentQuizId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the request headers
        },
          body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to update quiz');
      alert('Quiz updated successfully');
      document.getElementById('edit-quiz-form').style.display = 'none';
      fetchQuizzes(true); // Refresh the quiz list for manage quizzes
  } catch (error) {
      console.error('Error updating quiz:', error);
  }
});


document.addEventListener('DOMContentLoaded', function () {
  // Fetch quizzes for manage quizzes page
  if (window.location.pathname.endsWith('manage-quizzes.html')) {
      fetchQuizzes(true);
  }

  // Add event listeners
  const createQuizButton = document.getElementById('create-quiz-button');

  if (createQuizButton) {
      createQuizButton.addEventListener('click', openCreateQuizForm);
  }


  // Fetch quiz data if on quiz.html page
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('quizId');
  if (quizId && window.location.pathname.endsWith('quiz.html')) {
      loadQuiz(quizId);
  }
});

// Function to view the quiz
function viewQuiz(quizId) {
  console.log(`Navigating to quiz.html with quizId: ${quizId}`);
  window.location.href = `quiz.html?quizId=${quizId}`;
}

// Function to fetch and display quizzes
async function fetchQuizzes(forManage = false) {
  try {
      const response = await fetch('/api/quizzes',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
      });
      if (!response.ok) throw new Error(`Failed to fetch quizzes: ${response.statusText}`);
      const quizzes = await response.json();
      displayQuizzes(quizzes, forManage);
  } catch (error) {
      console.error('Error fetching quizzes:', error);
  }
}

// Function to display quizzes
function displayQuizzes(quizzes, forManage = false) {
  const quizList = document.getElementById(forManage ? 'quiz-list' : 'quiz-container');
  if (!quizList) {
      console.error('Quiz list container not found.');
      return;
  }

  quizList.innerHTML = '';

  if (quizzes.length === 0) {
      quizList.innerHTML = '<p>No quizzes available</p>';
      return;
  }

  quizzes.forEach(quiz => {
      const quizItem = document.createElement('div');
      quizItem.className = 'quiz-item';
      if (forManage) {
          quizItem.innerHTML = `
              <h3>${quiz.QuizTitle}</h3>
              <p>Number of Questions: ${quiz.QuestionsCount}</p>
              <button onclick="openEditForm(${quiz.QuizId}, '${quiz.QuizTitle}')">Edit</button>
              <button class="delete-button" data-quiz-id="${quiz.QuizId}">Delete</button>
              <button onclick="viewQuiz(${quiz.QuizId})">View</button>
          `;
      } else {
          quizItem.innerHTML = `
              <h3>${quiz.QuizTitle}</h3>
              <p>Number of Questions: ${quiz.QuestionsCount}</p>
              <button onclick="loadQuiz(${quiz.QuizId})">Start Quiz</button>
          `;
      }
      quizList.appendChild(quizItem);
  });

  if (forManage) attachDeleteListeners();
}


document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('quizId');
  if (quizId) {
      loadQuiz(quizId);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const saveQuizButton = document.getElementById('save-quiz-button');
  const editQuizForm = document.getElementById('edit-quiz-form');
  const editQuizTitleInput = document.getElementById('edit-quiz-title');
  const cancelEditButton = document.getElementById('cancel-edit-button');
  const createQuizButton = document.getElementById('create-quiz-button');
  const saveNewQuizButton = document.getElementById('save-new-quiz-button');
  const cancelNewQuizButton = document.getElementById('cancel-new-quiz-button');
  const nextOptionButton = document.getElementById('next-option-button');
  const addQuestionButton = document.getElementById('add-question-button');
  const createQuizForm = document.getElementById('create-quiz-form');

  if (createQuizButton) {
      createQuizButton.addEventListener('click', openCreateQuizForm);
  }

  if (cancelNewQuizButton) {
      cancelNewQuizButton.addEventListener('click', function () {
          createQuizForm.style.display = 'none';
      });
  }

  if (nextOptionButton) {
      nextOptionButton.addEventListener('click', handleNextOption);
  }

  if (addQuestionButton) {
      addQuestionButton.addEventListener('click', handleAddQuestion);
  }

  if (saveNewQuizButton) {
    saveNewQuizButton.addEventListener('click', handleSaveNewQuiz);
}


  if (saveQuizButton) {
      saveQuizButton.addEventListener('click', async () => {
          const newTitle = editQuizTitleInput.value;
          const questions = Array.from(document.querySelectorAll('.edit-question-block')).map((block, questionIndex) => {
              const questionTitle = document.getElementById(`edit-question-${questionIndex + 1}`).value;
              const options = Array.from(block.querySelectorAll('.edit-option-block')).map((optionBlock, optionIndex) => {
                  const optionText = document.getElementById(`edit-option-${questionIndex + 1}-${optionIndex + 1}`).value;
                  const explanation = document.getElementById(`edit-explanation-${questionIndex + 1}-${optionIndex + 1}`).value;
                  const correct = document.getElementById(`edit-correct-answer-${questionIndex + 1}-${optionIndex + 1}`).checked;
                  return { OptionName: optionText, Explanation: explanation, IsCorrectOption: correct };
              });
              return { QuestionTitle: questionTitle, options };
          });

          try {
              const response = await fetch(`/api/quizzes/${currentQuizId}`, {
                  method: 'PUT',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the request headers
                 },
                  body: JSON.stringify({ QuizTitle: newTitle, questions })
              });
              if (!response.ok) throw new Error('Failed to update quiz');
              editQuizForm.style.display = 'none';
              fetchQuizzes(true); // Refresh the quiz list for manage quizzes
          } catch (error) {
              console.error('Error updating quiz:', error);
          }
      });
  }

  
  if (cancelEditButton) {
      cancelEditButton.addEventListener('click', () => {
          editQuizForm.style.display = 'none';
      });
  }

  function handleSaveNewQuiz() {
    const newTitle = document.getElementById('new-quiz-title').value;
    const sectionNo = document.getElementById('new-section-no').value;
    const courseId = document.getElementById('new-course-id').value;
    const questions = [];

    for (let i = 1; i <= currentQuestionBlockIndex; i++) {
        const questionTitle = document.getElementById(`new-question-${i}`).value;
        const options = [];

        for (let j = 1; j <= 4; j++) {
            const optionText = document.getElementById(`new-option-${j}-${i}`).value;
            const explanation = document.getElementById(`new-explanation-1-${j}-${i}`).value;
            const correct = document.getElementById(`new-correct-answer-${j}-${i}`).checked;

            if (optionText && explanation) {
                options.push({ OptionName: optionText, Explanation: explanation, IsCorrectOption: correct });
            }
        }

        if (questionTitle && options.length > 0) {
            questions.push({ QuestionTitle: questionTitle, options });
        }
    }

    const quizData = {
        QuizTitle: newTitle,
        Section_Quiz: sectionNo,
        Course_Quiz: courseId,
        questions: questions
    };

    console.log('Preparing to send create request', quizData);

    createQuiz(quizData);
}

  // Save the updated quiz data
document.getElementById('save-quiz-button').addEventListener('click', async () => {
  const newTitle = document.getElementById('edit-quiz-title').value;
  const questions = [];
  const questionBlocks = document.querySelectorAll('[id^="edit-question-block-"]');

  questionBlocks.forEach((block, qIndex) => {
      const questionTitle = document.getElementById(`edit-question-${qIndex + 1}`).value;
      const options = [];

      for (let oIndex = 1; oIndex <= 4; oIndex++) {
          const optionName = document.getElementById(`edit-option-${oIndex}-${qIndex + 1}`).value;
          const explanation = document.getElementById(`edit-explanation-${oIndex}-${qIndex + 1}`).value;
          const isCorrect = document.getElementById(`edit-correct-answer-${oIndex}-${qIndex + 1}`).checked;

          options.push({
              OptionName: optionName,
              Explanation: explanation,
              IsCorrectOption: isCorrect
          });
      }

      questions.push({
          QuestionTitle: questionTitle,
          options: options
      });
  });

  try {
      const response = await fetch(`http://localhost:3000/api/quizzes/${currentQuizId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the request headers
         },
          body: JSON.stringify({ QuizTitle: newTitle, questions: questions })
      });
      if (!response.ok) throw new Error('Failed to update quiz');
      document.getElementById('edit-quiz-form').style.display = 'none';
      fetchQuizzes(true); // Refresh the quiz list for manage quizzes
  } catch (error) {
      console.error('Error updating quiz:', error);
  }
});

  if (window.location.pathname.endsWith('manage-quizzes.html')) {
      fetchQuizzes(true); // Fetch quizzes for manage quizzes
  }
});


// Function to attach delete listeners
function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const quizId = this.getAttribute('data-quiz-id');
            deleteQuiz(quizId);
        });
    });
}

// Function to delete a quiz
async function deleteQuiz(quizId) {
    try {
        console.log(`Sending DELETE request for quizId: ${quizId}`);
        const response = await fetch(`/api/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });
        if (!response.ok) throw new Error(`Failed to delete quiz: ${response.statusText}`);
        alert('Quiz deleted successfully');
        fetchQuizzes(true); // Refresh the quiz list for manage quizzes
    } catch (error) {
        console.error('Error deleting quiz:', error);
    }
}

// Function to create a new quiz
async function createQuiz(quizData) {
    try {
        const response = await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
             },
            body: JSON.stringify(quizData)
        });
        if (!response.ok) throw new Error('Failed to create quiz');
        const result = await response.json();
        console.log('Created Quiz:', result);
        currentQuizId = result.QuizId;
        fetchQuizzes(true); // Fetch quizzes for manage quizzes
        const questionForm = document.getElementById('question-form');
        if (questionForm) questionForm.style.display = 'block';
    } catch (error) {
        console.error('Error creating quiz:', error);
    }
}

// Function to handle the creation of quiz options one by one
function handleNextOption() {
    const optionText = document.getElementById(`new-option-${currentOptionIndex + 1}-${currentQuestionBlockIndex}`).value;
    const explanationText = document.getElementById(`new-explanation-1-${currentOptionIndex + 1}-${currentQuestionBlockIndex}`).value;
    const isCorrect = document.getElementById(`new-correct-answer-${currentOptionIndex + 1}-${currentQuestionBlockIndex}`).checked;

    if (optionText && explanationText) {
        newQuizData.questions[currentQuestionBlockIndex - 1].options.push({
            OptionName: optionText,
            Explanation: explanationText,
            IsCorrectOption: isCorrect
        });

        // Hide the current option container
        document.getElementById(`option-${currentOptionIndex + 1}-container-${currentQuestionBlockIndex}`).style.display = 'none';
        
        currentOptionIndex++;
        if (currentOptionIndex < 4) {
            // Show the next option container
            document.getElementById(`option-${currentOptionIndex + 1}-container-${currentQuestionBlockIndex}`).style.display = 'block';
        } else {
            // Show the save button and hide the next option button
            document.getElementById('save-new-quiz-button').style.display = 'block';
            document.getElementById('next-option-button').style.display = 'none';
        }
    } else {
        alert('Please fill in all fields for the option.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
  const addQuestionButton = document.getElementById('edit-add-question-button');

  if (addQuestionButton) {
      addQuestionButton.addEventListener('click', handleAddEditQuestion);
  }
});

// Function to handle adding a new question
function handleAddQuestion() {
    currentQuestionBlockIndex++;
    currentOptionIndex = 0;
    newQuizData.questions.push({
        QuestionTitle: '',
        options: []
    });

    // Hide all previous question blocks
    const allQuestionBlocks = document.querySelectorAll('[id^="question-block-"]');
    allQuestionBlocks.forEach(block => {
        block.style.display = 'none';
    });

    const questionBlock = document.createElement('div');
    questionBlock.id = `question-block-${currentQuestionBlockIndex}`;
    questionBlock.innerHTML = `
        <label for="new-question-${currentQuestionBlockIndex}">Question ${currentQuestionBlockIndex}:</label>
        <input type="text" id="new-question-${currentQuestionBlockIndex}">

        <div id="option-1-container-${currentQuestionBlockIndex}" class="option-container active">
            <label for="new-option-1-${currentQuestionBlockIndex}">Option 1:</label>
            <input type="text" id="new-option-1-${currentQuestionBlockIndex}">
            <label for="new-explanation-1-1-${currentQuestionBlockIndex}">Explanation 1:</label>
            <input type="text" id="new-explanation-1-1-${currentQuestionBlockIndex}">
            <label for="new-correct-answer-1-${currentQuestionBlockIndex}">Correct Answer:</label>
            <input type="radio" id="new-correct-answer-1-${currentQuestionBlockIndex}" name="correct-answer-${currentQuestionBlockIndex}" value="1">
        </div>

        <div id="option-2-container-${currentQuestionBlockIndex}" class="option-container">
            <label for="new-option-2-${currentQuestionBlockIndex}">Option 2:</label>
            <input type="text" id="new-option-2-${currentQuestionBlockIndex}">
            <label for="new-explanation-1-2-${currentQuestionBlockIndex}">Explanation 2:</label>
            <input type="text" id="new-explanation-1-2-${currentQuestionBlockIndex}">
            <label for="new-correct-answer-2-${currentQuestionBlockIndex}">Correct Answer:</label>
            <input type="radio" id="new-correct-answer-2-${currentQuestionBlockIndex}" name="correct-answer-${currentQuestionBlockIndex}" value="2">
        </div>

        <div id="option-3-container-${currentQuestionBlockIndex}" class="option-container">
            <label for="new-option-3-${currentQuestionBlockIndex}">Option 3:</label>
            <input type="text" id="new-option-3-${currentQuestionBlockIndex}">
            <label for="new-explanation-1-3-${currentQuestionBlockIndex}">Explanation 3:</label>
            <input type="text" id="new-explanation-1-3-${currentQuestionBlockIndex}">
            <label for="new-correct-answer-3-${currentQuestionBlockIndex}">Correct Answer:</label>
            <input type="radio" id="new-correct-answer-3-${currentQuestionBlockIndex}" name="correct-answer-${currentQuestionBlockIndex}" value="3">
        </div>

        <div id="option-4-container-${currentQuestionBlockIndex}" class="option-container">
            <label for="new-option-4-${currentQuestionBlockIndex}">Option 4:</label>
            <input type="text" id="new-option-4-${currentQuestionBlockIndex}">
            <label for="new-explanation-1-4-${currentQuestionBlockIndex}">Explanation 4:</label>
            <input type="text" id="new-explanation-1-4-${currentQuestionBlockIndex}">
            <label for="new-correct-answer-4-${currentQuestionBlockIndex}">Correct Answer:</label>
            <input type="radio" id="new-correct-answer-4-${currentQuestionBlockIndex}" name="correct-answer-${currentQuestionBlockIndex}" value="4">
        </div>
    `;

    const createQuizForm = document.getElementById('create-quiz-form');
    createQuizForm.insertBefore(questionBlock, document.getElementById('add-question-button').parentElement);

    // Reset buttons for new question
    document.getElementById('save-new-quiz-button').style.display = 'none';
    document.getElementById('next-option-button').style.display = 'block';
}

function openCreateQuizForm() {
    const createQuizForm = document.getElementById('create-quiz-form');
    if (createQuizForm) {
        createQuizForm.style.display = 'block';
    }
}

// Add event listeners for submit and next buttons
document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submit');
    const nextButton = document.getElementById('next');

    if (submitButton) submitButton.addEventListener('click', showResults);
    if (nextButton) nextButton.addEventListener('click', nextQuestion);
});


/*--------------------------------  Guan Quan Functions --------------------------------*/
