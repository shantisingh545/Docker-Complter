package com.gamified.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.azure.openai.AzureOpenAiChatModel;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {
    
    private final AzureOpenAiChatModel chatModel;
    
    public String getChatResponse(String userMessage) {
        try {
            String systemPrompt = "You are a helpful AI tutor for students. Provide clear, encouraging, and educational responses. Keep answers concise and engaging.";
            
            Prompt prompt = new Prompt(new UserMessage(systemPrompt + "\n\nStudent: " + userMessage));
            return chatModel.call(prompt).getResult().getOutput().getText();
        } catch (Exception e) {
            return "I'm sorry, I'm currently unavailable. Please try again later or contact your teacher for help with: " + userMessage;
        }
    }
    
    public String generateQuizQuestion(String subject) {
        // Try multiple times with different approaches before falling back
        for (int attempt = 0; attempt < 3; attempt++) {
            try {
                String[] questionTypes = {
                    "a fundamental concept question",
                    "an application-based question", 
                    "a critical thinking question",
                    "a definition and explanation question",
                    "an analytical question",
                    "a comparison question",
                    "a cause-and-effect question"
                };
                
                String[] difficultyLevels = {
                    "beginner friendly",
                    "intermediate level", 
                    "moderately challenging"
                };
                
                String randomType = questionTypes[(int) (Math.random() * questionTypes.length)];
                String randomDifficulty = difficultyLevels[(int) (Math.random() * difficultyLevels.length)];
                long timestamp = System.currentTimeMillis() + attempt;
                
                String prompt = "You are an expert educator. Create " + randomType + " at " + randomDifficulty + " specifically about " + subject + 
                               ". Use this unique seed: " + timestamp + 
                               ". IMPORTANT: Return ONLY valid JSON in this EXACT format with no extra text: " +
                               "{\"question\": \"Your question here?\", \"options\": [\"A) option1\", \"B) option2\", \"C) option3\", \"D) option4\"], \"correctAnswer\": 0}. " +
                               "The correctAnswer must be the index (0-3) of the correct option. " +
                               "Make the question engaging, educational, and strictly related to " + subject + ". " +
                               "Ensure all options are plausible but only one is correct.";
                
                Prompt aiPrompt = new Prompt(new UserMessage(prompt));
                String response = chatModel.call(aiPrompt).getResult().getOutput().getText();
                
                // Validate the response is proper JSON
                if (response.trim().startsWith("{") && response.trim().endsWith("}")) {
                    return response;
                }
                
                // If not proper JSON, try again
                Thread.sleep(500); // Small delay between attempts
                
            } catch (Exception e) {
                if (attempt == 2) {
                    // Only use fallback after all attempts failed
                    return getSubjectSpecificFallback(subject);
                }
                try {
                    Thread.sleep(1000); // Wait before retry
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        
        return getSubjectSpecificFallback(subject);
    }
    
    private String getSubjectSpecificFallback(String subject) {
        // Subject-specific fallback questions
        switch (subject.toLowerCase()) {
            case "math":
                return "{\"question\": \"What is 12 + 8?\", \"options\": [\"A) 18\", \"B) 20\", \"C) 22\", \"D) 24\"], \"correctAnswer\": 1}";
            case "science":
                return "{\"question\": \"What is the chemical symbol for water?\", \"options\": [\"A) H2O\", \"B) CO2\", \"C) NaCl\", \"D) O2\"], \"correctAnswer\": 0}";
            case "history":
                return "{\"question\": \"In which year did World War II end?\", \"options\": [\"A) 1944\", \"B) 1945\", \"C) 1946\", \"D) 1947\"], \"correctAnswer\": 1}";
            case "literature":
                return "{\"question\": \"Who wrote 'Romeo and Juliet'?\", \"options\": [\"A) Charles Dickens\", \"B) William Shakespeare\", \"C) Jane Austen\", \"D) Mark Twain\"], \"correctAnswer\": 1}";
            case "geography":
                return "{\"question\": \"What is the largest continent?\", \"options\": [\"A) Africa\", \"B) Asia\", \"C) North America\", \"D) Europe\"], \"correctAnswer\": 1}";
            default:
                return "{\"question\": \"What does 'AI' stand for?\", \"options\": [\"A) Artificial Intelligence\", \"B) Advanced Information\", \"C) Automated Input\", \"D) Applied Integration\"], \"correctAnswer\": 0}";
        }
    }
    
    public String generateTypingText() {
        try {
            String prompt = "Generate a random educational sentence (10-15 words) for typing practice. " +
                           "Make it about science, history, or literature. Return only the sentence.";
            
            Prompt aiPrompt = new Prompt(new UserMessage(prompt));
            return chatModel.call(aiPrompt).getResult().getOutput().getText();
        } catch (Exception e) {
            String[] fallbackTexts = {
                "The quick brown fox jumps over the lazy dog.",
                "Science is the systematic study of the natural world.",
                "History teaches us about the past and shapes our future.",
                "Literature opens windows to different worlds and perspectives."
            };
            return fallbackTexts[(int) (Math.random() * fallbackTexts.length)];
        }
    }
    
    public String generateScrambleWord(String subject) {
        try {
            long timestamp = System.currentTimeMillis();
            int randomSeed = (int) (Math.random() * 1000);
            
            String prompt = "Generate a unique educational word related to " + subject + 
                           ". The word should be 5-10 letters long and commonly known. " +
                           "Use this unique seed: " + timestamp + randomSeed + 
                           ". Make it different from common words like SCIENCE, HISTORY, MATH. " +
                           "Return ONLY the word in uppercase, nothing else.";
            
            Prompt aiPrompt = new Prompt(new UserMessage(prompt));
            String response = chatModel.call(aiPrompt).getResult().getOutput().getText().trim().toUpperCase();
            
            // Clean response to get only the word
            response = response.replaceAll("[^A-Z]", "");
            
            return response.isEmpty() ? getRandomFallbackWord(subject) : response;
        } catch (Exception e) {
            return getRandomFallbackWord(subject);
        }
    }
    
    public String generateWordHint(String word, String subject) {
        try {
            String prompt = "Create a helpful hint for the word '" + word + "' in the subject " + subject + 
                           ". The hint should give a clear definition or description without saying the word directly. " +
                           "Make it educational and specific. Return only the hint text.";
            
            Prompt aiPrompt = new Prompt(new UserMessage(prompt));
            return chatModel.call(aiPrompt).getResult().getOutput().getText().trim();
        } catch (Exception e) {
            return "This word is commonly used in " + subject + " and has " + word.length() + " letters.";
        }
    }
    
    private String getRandomFallbackWord(String subject) {
        String[][] subjectWords = {
            {"ALGEBRA", "GEOMETRY", "CALCULUS", "FRACTION", "EQUATION", "TRIANGLE", "DECIMAL", "PERCENT"}, // Math
            {"MOLECULE", "ELECTRON", "GRAVITY", "ENERGY", "PHOTON", "NUCLEUS", "CARBON", "OXYGEN"}, // Science
            {"ANCIENT", "EMPIRE", "DYNASTY", "CULTURE", "TREATY", "KINGDOM", "BATTLE", "COLONY"}, // History
            {"METAPHOR", "POETRY", "NOVEL", "AUTHOR", "CHAPTER", "VERSE", "PROSE", "DRAMA"}, // Literature
            {"CONTINENT", "MOUNTAIN", "OCEAN", "CLIMATE", "DESERT", "FOREST", "VALLEY", "ISLAND"} // Geography
        };
        
        int subjectIndex = switch (subject.toLowerCase()) {
            case "math" -> 0;
            case "science" -> 1;
            case "history" -> 2;
            case "literature" -> 3;
            case "geography" -> 4;
            default -> (int) (Math.random() * subjectWords.length);
        };
        
        String[] words = subjectWords[subjectIndex];
        return words[(int) (Math.random() * words.length)];
    }
    
    public String generateMemorySequence(int length) {
        try {
            StringBuilder sequence = new StringBuilder();
            for (int i = 0; i < length; i++) {
                sequence.append((int) (Math.random() * 9) + 1);
                if (i < length - 1) sequence.append(",");
            }
            return sequence.toString();
        } catch (Exception e) {
            return "1,2,3,4,5";
        }
    }
}