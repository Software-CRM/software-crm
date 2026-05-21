import React from 'react';
import { 
  RefreshCw, 
  CheckSquare, 
  ArrowRight, 
  Clock, 
  Zap, 
  Calendar,
  MoreVertical,
  Plus,
  MessageSquare,
  Users,
  Paperclip,
  Phone,
  Share2,
  Smile,
  Send,
  Video,
  Mic
} from 'lucide-react';
import './EmployeeOverview.css';
import { formatDate } from '../../../utils/dateUtils';

const EmployeeOverview = ({ user }) => {
  return (
    <div className="dashboard-root">
      <div className="dashboard-main">
        {/* Top Header Card */}
        <header className="greeting-card">
          <div className="greeting-content">
            <h1>Good morning,</h1>
            <h2>{user?.fullName || 'Reshma M'} 👋</h2>
            <p>You have 2 meetings and 3 tasks today.</p>
          </div>
          <div className="greeting-meta">
            <span className="date-pill">{formatDate()}</span>
            <div className="action-btns">
              <button className="icon-btn-glass"><RefreshCw size={18} /></button>
              <button className="icon-btn-glass"><BellIcon size={18} /><span className="dot"></span></button>
            </div>
          </div>
        </header>

        {/* Local Tab Bar */}
        <nav className="dashboard-local-nav">
          <button className="active">Overview</button>
          <button>Canvas</button>
          <button>Calendar</button>
          <button className="ai-btn"><Zap size={14} /> Ask CRM AI</button>
          
          <div className="team-avatars-row">
            <img src="https://i.pravatar.cc/100?img=11" alt="t1" />
            <img src="https://i.pravatar.cc/100?img=12" alt="t2" />
            <img src="https://i.pravatar.cc/100?img=13" alt="t3" />
            <span className="more-count">+5</span>
          </div>
        </nav>

        <div className="dashboard-grid">
          {/* Left Column: Tasks & Projects */}
          <div className="grid-col-left">
            <section className="dashboard-card tasks-card">
              <div className="card-header">
                <h3><CheckSquare size={18} /> Your tasks</h3>
                <div className="header-actions">
                  <RefreshCw size={14} />
                  <Plus size={16} />
                </div>
              </div>
              <div className="task-items">
                <div className="task-item-premium">
                  <input type="checkbox" defaultChecked />
                  <div className="task-info">
                    <p className="task-name">Review Q4 marketing strategy deck</p>
                    <div className="task-tags">
                      <span className="p-badge high">High</span>
                      <span className="tag">Marketing strategy</span>
                      <span className="meta"><Users size={12}/> 2</span>
                      <span className="meta"><MessageSquare size={12}/> 4</span>
                      <span className="meta"><Paperclip size={12}/> 1</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="arrow" />
                </div>
                
                <div className="task-item-premium">
                  <input type="checkbox" />
                  <div className="task-info">
                    <p className="task-name">Update design system documentation</p>
                    <div className="task-tags">
                      <span className="p-badge medium">Medium</span>
                      <span className="meta"><MessageSquare size={12}/> 2</span>
                      <span className="meta"><Paperclip size={12}/> 6</span>
                      <span className="by">by: Chandini - Your team</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="arrow" />
                </div>
              </div>
            </section>

            <section className="dashboard-card projects-card">
               <div className="card-header">
                <h3>Projects in progress</h3>
                <div className="header-actions">
                  <RefreshCw size={14} />
                  <Plus size={16} />
                </div>
              </div>
              <div className="project-compact-item">
                <div className="p-icon pink"><Zap size={18}/></div>
                <div className="p-content">
                  <h4>Case study UX research</h4>
                  <p>On track</p>
                  <div className="p-metrics">
                    <span><MessageSquare size={12}/> 23 comments</span>
                    <span><Paperclip size={12}/> 8 files</span>
                    <span><CheckSquare size={12}/> 3 tasks</span>
                  </div>
                </div>
                <div className="p-status">
                  <span className="target">Target: in 2 days</span>
                  <div className="p-progress-bar"><div className="fill" style={{width: '35%'}}></div></div>
                  <button className="view-btn">View <ArrowRight size={14}/></button>
                </div>
              </div>
            </section>
          </div>

          {/* Center Column: Attendance & Intelligence */}
          <div className="grid-col-center">
            <section className="dashboard-card attendance-compact">
              <div className="clock-header">
                <div className="time-col">
                  <span className="label">Clock in</span>
                  <span className="val">09:05AM</span>
                </div>
                <div className="timer">03:05:34</div>
                <div className="time-col">
                  <span className="label">Clock out</span>
                  <span className="val">--:--</span>
                </div>
              </div>
              <div className="clock-progress-track">
                <div className="fill" style={{width: '40%'}}></div>
              </div>
              <button className="clock-btn-premium">Clock out</button>
              <p className="motivational-text">🔥 You are on fire since morning. Keep rocking!</p>
            </section>

            <section className="dashboard-card ai-insight-card">
              <div className="card-header">
                <h3><Zap size={18} /> Intelligence</h3>
              </div>
              <div className="insight-item">
                <div className="i-icon purple"><Calendar size={14}/></div>
                <p>Based on your schedule, focus on <strong>Project Alpha</strong> you have meeting at 3PM Today!</p>
              </div>
              <div className="insight-item">
                <div className="i-icon green"><TrendingUpIcon size={14}/></div>
                <p>You're 25% more productive on Mondays. Use this momentum to tackle high-priority items.</p>
              </div>
            </section>

            <section className="dashboard-card leaves-card">
              <div className="card-header">
                <h3>Leave balances</h3>
                <button className="text-btn">Apply leave</button>
              </div>
              <div className="leaves-row">
                <div className="leave-circle">
                  <div className="c-ring purple" style={{"--p": 60}}><span>15</span></div>
                  <p>Unpaid</p>
                </div>
                <div className="leave-circle">
                  <div className="c-ring blue" style={{"--p": 30}}><span>3</span></div>
                  <p>PTO</p>
                </div>
                <div className="leave-circle">
                  <div className="c-ring orange" style={{"--p": 80}}><span>23</span></div>
                  <p>Other</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Chat System */}
      <aside className="dashboard-chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>Reply for your chats!</h3>
          <div className="header-actions">
            <RefreshCw size={16} />
            <MessageSquare size={16} />
          </div>
        </div>

        <div className="chat-section">
          <div className="section-title">Your DM's <ArrowDown size={14}/></div>
          <div className="dm-list">
            <div className="dm-item active">
              <img src="https://i.pravatar.cc/100?img=50" alt="Satish" />
              <div className="dm-info">
                <strong>Satish</strong>
                <span>Marketing team lead</span>
              </div>
              <span className="time">10:05AM</span>
              <span className="unread">2</span>
            </div>
            <div className="dm-item">
              <img src="https://i.pravatar.cc/100?img=44" alt="Saranya" />
              <div className="dm-info">
                <strong>Saranya</strong>
                <span>Design team</span>
              </div>
              <span className="time">11:23AM</span>
              <span className="unread">4</span>
            </div>
          </div>
        </div>

        <div className="chat-active-window">
          <div className="chat-window-header">
             <img src="https://i.pravatar.cc/100?img=50" alt="Satish" />
             <div className="header-info">
               <strong>Satish</strong>
               <span>Marketing team lead</span>
             </div>
             <div className="header-actions">
               <Phone size={16} />
               <Share2 size={16} />
               <MoreVertical size={16} />
             </div>
          </div>
          <div className="chat-history">
            <div className="msg received">
              <span className="msg-meta">Satish · 9:05AM</span>
              <p>Yes, I went through it last night. I have some feedback on the proposed budget allocations.</p>
            </div>
            <div className="msg received">
              <p>What are your thoughts on the new social media campaigns?</p>
            </div>
            <div className="msg sent">
              <span className="msg-meta">You · 9:07AM</span>
              <p>I think the campaigns look promising but might need more focus on engagement metrics.</p>
            </div>
          </div>
          <div className="chat-input-premium">
            <div className="formatting-bar">
              <button>B</button>
              <button>I</button>
              <button>S</button>
              <div className="divider"></div>
              <Paperclip size={16} />
              <CheckSquare size={16} />
              <Users size={16} />
              <div className="divider"></div>
              <div className="code-icon">&lt;/&gt;</div>
            </div>
            <div className="input-row">
              <Plus size={18} />
              <input type="text" placeholder="Message satish..." />
              <Smile size={18} />
              <Users size={18} />
              <Video size={18} />
              <Mic size={18} />
              <button className="send-btn-circle"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const BellIcon = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const TrendingUpIcon = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const ArrowDown = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default EmployeeOverview;
