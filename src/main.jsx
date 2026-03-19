import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import IrregularMenu from './pages/irregularVerbs/Menu.jsx'
import WriteMode from './pages/irregularVerbs/WriteMode.jsx'
import ChoiceMode from './pages/irregularVerbs/ChoiceMode.jsx'
import MatchMode from './pages/irregularVerbs/MatchMode.jsx'
import SpeedMode from './pages/irregularVerbs/SpeedMode.jsx'
import Dictionary from './pages/irregularVerbs/Dictionary.jsx'
import Settings from './pages/irregularVerbs/Settings.jsx'
import TensesMenu from './pages/tenses/Menu.jsx'
import FillBlank from './pages/tenses/FillBlank.jsx'
import ChooseTense from './pages/tenses/ChooseTense.jsx'
import TransformSentence from './pages/tenses/TransformSentence.jsx'
import PrepositionsMenu from './pages/prepositions/Menu.jsx'
import PrepositionExercise from './pages/prepositions/PrepositionExercise.jsx'
import ArticleExercise from './pages/prepositions/ArticleExercise.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ProgressProvider>
        <Routes>
          <Route element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="irregular-verbs" element={<IrregularMenu />} />
            <Route path="irregular-verbs/write" element={<WriteMode />} />
            <Route path="irregular-verbs/choice" element={<ChoiceMode />} />
            <Route path="irregular-verbs/match" element={<MatchMode />} />
            <Route path="irregular-verbs/speed" element={<SpeedMode />} />
            <Route path="irregular-verbs/dictionary" element={<Dictionary />} />
            <Route path="irregular-verbs/settings" element={<Settings />} />
            <Route path="tenses" element={<TensesMenu />} />
            <Route path="tenses/:tenseId/fill-blank" element={<FillBlank />} />
            <Route path="tenses/:tenseId/choose-tense" element={<ChooseTense />} />
            <Route path="tenses/:tenseId/transform" element={<TransformSentence />} />
            <Route path="prepositions" element={<PrepositionsMenu />} />
            <Route path="prepositions/prepositions-time" element={<PrepositionExercise groupId="time" />} />
            <Route path="prepositions/prepositions-place" element={<PrepositionExercise groupId="place" />} />
            <Route path="prepositions/articles" element={<ArticleExercise />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
)
