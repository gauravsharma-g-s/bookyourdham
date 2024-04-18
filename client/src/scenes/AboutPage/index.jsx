import React from 'react'

function About() {
    React.useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page when component mounts
      }, []); // Empty dependency array ensures the effect runs only once
    return (
        <div>
        <div class="container mx-auto py-12 px-6">
  <h1 class="text-4xl font-bold text-center mb-8">About Us</h1>

  <div class="bg-red-500 text-white rounded-lg p-8 mb-8">
    <h2 class="text-3xl font-bold mb-4">Welcome to BookYourDham</h2>
    <ul class="list-disc list-inside">
      <li class="text-xl mb-2">Your one-stop destination for hassle-free event catering!</li>
      <li class="text-xl mb-2">Wide selection of delicious dishes, from traditional favorites to modern culinary delights.</li>
      <li class="text-xl mb-2">Easy online ordering and flexible delivery options.</li>
      <li class="text-xl mb-2">Whether you're hosting an intimate dinner party or a grand wedding celebration, BookYourDham has everything you need to make your event a success!</li>
    </ul>
  </div>

  <div class="bg-blue-500 text-white rounded-lg p-8 mb-8">
    <h2 class="text-3xl font-bold mb-4">Our Commitment to Security</h2>
    <ul class="list-disc list-inside">
      <li class="text-xl mb-2">State-of-the-art encryption technology to ensure that your data remains safe and secure.</li>
      <li class="text-xl mb-2">Strict privacy policies and industry best practices to protect your information from unauthorized access or misuse.</li>
      <li class="text-xl mb-2">Your security and privacy are our top priorities, and we are committed to providing you with a safe and secure online experience.</li>
    </ul>
  </div>

  <div class="bg-green-500 text-white rounded-lg p-8 mb-8">
    <h2 class="text-3xl font-bold mb-4">Our Policies</h2>
    <ul class="list-disc list-inside">
      <li class="text-xl mb-2">Transparency and fairness are core values at BookYourDham.</li>
      <li class="text-xl mb-2">Our terms of service outline the rules and guidelines for using our platform.</li>
      <li class="text-xl mb-2">Our privacy policy explains how we collect, use, and protect your personal information.</li>
      <li class="text-xl mb-2">We also have a refund/return policy in place to ensure that our users are satisfied with their purchases and transactions.</li>
    </ul>
  </div>

  <div class="bg-yellow-500 text-white rounded-lg p-8 mb-8">
    <h2 class="text-3xl font-bold mb-4">Terms of Service</h2>
    <ul class="list-disc list-inside">
      <li class="text-xl mb-2">By using BookYourDham, you agree to abide by our terms of service.</li>
      <li class="text-xl mb-2">You retain ownership of any content you submit to the platform.</li>
      <li class="text-xl mb-2">We reserve the right to terminate or suspend your account if you violate any of our terms or engage in prohibited activities on the platform.</li>
      <li class="text-xl mb-2">Your continued use of BookYourDham constitutes acceptance of our terms of service.</li>
    </ul>
  </div>
</div>



        </div>
    )
}

export default About
