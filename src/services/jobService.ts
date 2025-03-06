import { supabase } from '../lib/supabase';
import { JobListing, Application, Job, Interview, Notification } from '../types';
import { sendEmail } from '../lib/supabase';
import { format } from 'date-fns';

export async function getJobListings() {
  try {
    const { data, error } = await supabase
      .from('job_listings')
      .select(`
        *,
        employer:profiles(username)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching job listings:", error);
      return [];
    }

    // Transform the data to match our Job type
    return data.map(job => ({
      id: job.id,
      title: job.title,
      company: job.employer?.username || 'Unknown Company',
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
      createdAt: new Date(job.created_at),
      status: job.status,
      employerId: job.employer_id
    })) as Job[];
  } catch (err) {
    console.error("Error in getJobListings:", err);
    return [];
  }
}

export async function getJobListingById(id: string) {
  try {
    const { data, error } = await supabase
      .from('job_listings')
      .select(`
        *,
        employer:profiles(username, id)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as (JobListing & { employer: { username: string, id: string } });
  } catch (err) {
    console.error("Error fetching job details:", err);
    throw new Error('Job not found');
  }
}

export async function createJobListing(jobListing: Omit<JobListing, 'id' | 'created_at' | 'updated_at' | 'employer_id'>) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Check if user is an employer
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (profileError || profileData?.role !== 'employer') {
    throw new Error('Only employers can create job listings');
  }

  const { data, error } = await supabase
    .from('job_listings')
    .insert({
      ...jobListing,
      employer_id: userData.user.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as JobListing;
}

export async function updateJobListing(id: string, updates: Partial<JobListing>) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Check if user is the owner of the job listing
  const { data: jobData, error: jobError } = await supabase
    .from('job_listings')
    .select('employer_id')
    .eq('id', id)
    .single();

  if (jobError || jobData?.employer_id !== userData.user.id) {
    throw new Error('You can only update your own job listings');
  }

  const { data, error } = await supabase
    .from('job_listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as JobListing;
}

export async function deleteJobListing(id: string) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Check if user is the owner of the job listing
  const { data: jobData, error: jobError } = await supabase
    .from('job_listings')
    .select('employer_id')
    .eq('id', id)
    .single();

  if (jobError || jobData?.employer_id !== userData.user.id) {
    throw new Error('You can only delete your own job listings');
  }

  const { error } = await supabase
    .from('job_listings')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function getEmployerJobListings() {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('employer_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as JobListing[];
}

export async function applyToJob(jobId: string, coverLetter?: string) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Check if user is an employee
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (profileError || profileData?.role !== 'employee') {
    throw new Error('Only job seekers can apply to jobs');
  }

  // Check if user has already applied
  const { data: existingApplication, error: checkError } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('candidate_id', userData.user.id)
    .maybeSingle();

  if (checkError) {
    throw new Error('Error checking application status');
  }

  if (existingApplication) {
    throw new Error('You have already applied to this job');
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      job_id: jobId,
      candidate_id: userData.user.id,
      cover_letter: coverLetter,
      status: 'applied'
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Get job and employer details for notification
  const { data: jobData } = await supabase
    .from('job_listings')
    .select(`
      title,
      employer_id,
      employer:profiles(email)
    `)
    .eq('id', jobId)
    .single();

  if (jobData) {
    // Create notification for employer
    await createNotification({
      user_id: jobData.employer_id,
      title: 'New Job Application',
      message: `A new candidate has applied to your job: ${jobData.title}`,
      type: 'info',
      link: `/jobs/${jobId}/applications`
    });

    // Send email to employer if email exists
    if (jobData.employer?.email) {
      await sendEmail(
        jobData.employer.email,
        'New Job Application Received',
        `You have received a new application for the position: ${jobData.title}. Log in to your dashboard to review it.`
      );
    }
  }

  return data as Application;
}

export async function getUserApplications() {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:job_listings(
          id,
          title,
          location,
          type,
          employer:profiles(username)
        ),
        interview:interviews(*)
      `)
      .eq('candidate_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as (Application & { 
      job: JobListing & { 
        employer: { username: string } 
      },
      interview: Interview | null
    })[];
  } catch (err) {
    console.error("Error fetching user applications:", err);
    return [];
  }
}

export async function getJobApplications(jobId: string) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Check if user is the owner of the job listing
  const { data: jobData, error: jobError } = await supabase
    .from('job_listings')
    .select('employer_id')
    .eq('id', jobId)
    .single();

  if (jobError || jobData?.employer_id !== userData.user.id) {
    throw new Error('You can only view applications for your own job listings');
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        candidate:profiles(username, id),
        interview:interviews(*)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as (Application & { 
      candidate: { username: string, id: string },
      interview: Interview | null
    })[];
  } catch (err) {
    console.error("Error fetching job applications:", err);
    return [];
  }
}

export async function updateApplicationStatus(applicationId: string, status: Application['status'], feedback?: string) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Check if user is the employer for this application
  const { data: appData, error: appError } = await supabase
    .from('applications')
    .select(`
      job_id,
      candidate_id,
      job:job_listings(employer_id, title),
      candidate:profiles(email)
    `)
    .eq('id', applicationId)
    .single();

  if (appError || appData?.job?.employer_id !== userData.user.id) {
    throw new Error('You can only update applications for your own job listings');
  }

  const { data, error } = await supabase
    .from('applications')
    .update({
      status,
      feedback,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Create notification for candidate
  await createNotification({
    user_id: appData.candidate_id,
    title: 'Application Status Updated',
    message: `Your application for ${appData.job?.title} has been updated to: ${status.replace('_', ' ')}`,
    type: status === 'rejected' ? 'error' : status === 'selected' ? 'success' : 'info',
    link: `/employee-dashboard`
  });

  // Send email to candidate if email exists
  if (appData.candidate?.email) {
    let emailSubject = 'Your Job Application Status Has Been Updated';
    let emailContent = `Your application for the position of ${appData.job?.title} has been updated to: ${status.replace('_', ' ')}`;
    
    if (feedback) {
      emailContent += `\n\nFeedback: ${feedback}`;
    }
    
    if (status === 'selected') {
      emailContent += '\n\nCongratulations! The employer would like to schedule an interview with you. Please check your dashboard for more details.';
    }
    
    await sendEmail(
      appData.candidate.email,
      emailSubject,
      emailContent
    );
  }

  return data as Application;
}

export async function scheduleInterview(applicationId: string, interviewData: Omit<Interview, 'id' | 'application_id' | 'status' | 'created_at' | 'updated_at'>) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Check if user is the employer for this application
  const { data: appData, error: appError } = await supabase
    .from('applications')
    .select(`
      id,
      job_id,
      candidate_id,
      job:job_listings(employer_id, title),
      candidate:profiles(email, username)
    `)
    .eq('id', applicationId)
    .single();

  if (appError || appData?.job?.employer_id !== userData.user.id) {
    throw new Error('You can only schedule interviews for your own job listings');
  }

  // Create the interview
  const { data: interview, error: interviewError } = await supabase
    .from('interviews')
    .insert({
      application_id: applicationId,
      ...interviewData,
      status: 'scheduled'
    })
    .select()
    .single();

  if (interviewError) {
    throw new Error(interviewError.message);
  }

  // Update application status
  const { error: updateError } = await supabase
    .from('applications')
    .update({
      status: 'interview_scheduled',
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // Create notification for candidate
  await createNotification({
    user_id: appData.candidate_id,
    title: 'Interview Scheduled',
    message: `An interview has been scheduled for your application to ${appData.job?.title}`,
    type: 'success',
    link: `/employee-dashboard`
  });

  // Send email to candidate if email exists
  if (appData.candidate?.email) {
    const formattedDate = format(new Date(interviewData.scheduled_at), 'MMMM d, yyyy - h:mm a');
    const emailSubject = 'Interview Scheduled for Your Job Application';
    let emailContent = `
      Dear ${appData.candidate.username},
      
      We're pleased to inform you that an interview has been scheduled for your application to the position of ${appData.job?.title}.
      
      Interview Details:
      - Date and Time: ${formattedDate}
      - Duration: ${interviewData.duration} minutes
    `;
    
    if (interviewData.location) {
      emailContent += `\n- Location: ${interviewData.location}`;
    }
    
    if (interviewData.meeting_link) {
      emailContent += `\n- Meeting Link: ${interviewData.meeting_link}`;
    }
    
    if (interviewData.notes) {
      emailContent += `\n\nAdditional Notes: ${interviewData.notes}`;
    }
    
    emailContent += `\n\nPlease log in to your dashboard for more details.`;
    
    await sendEmail(
      appData.candidate.email,
      emailSubject,
      emailContent
    );
  }

  return interview as Interview;
}

export async function createNotification(notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notificationData,
        read: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw new Error('Failed to create notification');
  }
}

export async function getUserNotifications() {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Notification[];
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userData.user.id);

    if (error) {
      throw error;
    }

    return true;
  } catch (err) {
    console.error("Error marking notification as read:", err);
    throw new Error('Failed to mark notification as read');
  }
}

// Function to delete all job listings (for admin use only)
export async function deleteAllJobListings() {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  // Only delete the user's own job listings
  const { error } = await supabase
    .from('job_listings')
    .delete()
    .eq('employer_id', userData.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}