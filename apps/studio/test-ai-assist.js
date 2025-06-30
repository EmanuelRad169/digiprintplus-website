// Script to verify the AI Assist plugin is configured correctly
// Run this script in your browser console when Sanity Studio is open

function checkAIAssistSetup() {
  // Check if Sanity Studio is loaded
  if (!window.sanityClient) {
    console.error('❌ Sanity Studio is not loaded properly. Make sure you are running this in the Sanity Studio.');
    return;
  }

  // Check if AI Assist plugin is loaded
  const hasAssistPlugin = window.__SANITY_ASSIST__ !== undefined;
  if (!hasAssistPlugin) {
    console.error('❌ Sanity AI Assist plugin is not detected. Check your sanity.config.ts.');
    return;
  }
  
  console.log('✅ Sanity AI Assist plugin is installed correctly.');

  // Check OpenAI API key (indirect check)
  const assistConfig = window.__SANITY_ASSIST__?.config;
  if (assistConfig) {
    console.log('✅ AI Assist configuration detected.');
  } else {
    console.warn('⚠️ Could not detect AI Assist configuration. This could be normal as config details may be private.');
  }

  console.log('\n🧪 To test AI Assist:');
  console.log('1. Open a product document for editing');
  console.log('2. Look for the magic wand icon (✨) next to the description field');
  console.log('3. Click the icon and try generating content with a prompt');
  console.log('\nIf the magic wand icon is not visible or returns an error, check:');
  console.log('- Your OpenAI API key in the .env.local file');
  console.log('- Restart the studio after making changes to environment variables');
}

// Run the check
checkAIAssistSetup();
