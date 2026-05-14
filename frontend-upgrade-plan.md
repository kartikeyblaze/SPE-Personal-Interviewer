# Frontend Upgrade Plan: "The Scholar’s Study"

This plan outlines the visual and structural overhaul of the Personal Interviewer AI frontend, moving from a generic "tech" aesthetic to a premium "Classical/Academic" experience.

## 1. Visual Identity & Aesthetics
- **Theme Concept**: "The Scholar’s Study" – A grounding, mentorship-focused environment.
- **Color Palette**:
    - **Background**: Antique Cream (`#FDFCF0`) with a subtle paper grain texture.
    - **Typography**: Deep Espresso Brown (`#2C1E1A`).
    - **Primary Actions/Success**: Forest Green (`#2D4636`).
    - **Errors/Warnings**: Muted Terracotta (`#B24731`).
- **Typography**:
    - **Headings & AI Questions**: *EB Garamond* (Serif) – Elegant and authoritative.
    - **User Input (Handwritten)**: A clean, legible Script font (e.g., *Dancing Script* or *Caveat*) to contrast the AI.
    - **UI Elements**: *Montserrat* (Sans-serif) – Functional and modern.
- **Assets**: Minimalist pencil-sketch SVGs instead of standard icons or 3D graphics.

## 2. Component Overhaul
- **Layout**: "The Split-Leaf" view.
    - **Left Side**: Minimalist pencil-sketch of a "Mentor" figure. Pulsing opacity during AI processing.
    - **Right Side**: "The Ledger" – A vertical scrolling area where the interview is "inked" onto the page.
- **Navbar**: Minimalist header resembling a book's title page or a formal letterhead.
- **Results Page**: Designed as a "Formal Evaluation" or "Scholar's Report Card" with a Dark Green wax-seal style badge for completion.

## 3. Motion & Interaction (Framer Motion)
- **Functional Motion**:
    - **Inking Effect**: Questions and answers appear with a staggered, typewriter-style "inking" animation.
    - **Page Turns**: Transitions between routes (Home -> Interview -> Results) mimic the turning of a heavy book page.
    - **Voice Pulse**: A hand-drawn, sketchy circle around the microphone icon that vibrates organically when audio is detected.

## 4. Technical Recommendations
- **Styling**: Introduce **Tailwind CSS** for rapid palette and spacing management.
- **Animation**: Use **Framer Motion** for all functional transitions and micro-interactions.
- **State Management**: Continue using React Context API but ensure it is decoupled from the UI layer for easier theme swapping.

## 5. Potential Conflict Areas & Refined Strategy
- **Logic Decoupling**: Current interview logic is tightly coupled with UI in `speechToText.jsx`. 
    - *Action*: Extract logic into a `useInterview.js` hook before UI refactoring.
- **CSS Specificity**: Existing `.css` files will conflict with Tailwind. 
    - *Action*: Systematically purge component-specific CSS as Tailwind is introduced.
- **Video Integration**: The `Video` feed will remain a standard box but will be styled with a **Deep Brown (#4E342E) frame** to match the "Study" aesthetic.
- **Asset Strategy**: Minimalist pencil-sketch SVGs will be generated as placeholders for the "Mentor" persona and UI icons.

---
*Note: Planning phase complete. Ready for implementation.*
