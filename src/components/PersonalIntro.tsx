import { useProfile } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

const PersonalIntro = () => {
  const { data: profile, loading, error } = useProfile();

  if (error) {
    return (
      <div className="section personal-intro">
        <h2>個人簡介</h2>
        <div className="content">
          <div className="profile">
            <div className="avatar">👤</div>
            <div className="info">
              <h3>姓名：李宥榆</h3>
              <p>學號：111110504</p>
              <p>學校：國立金門大學</p>
              <p className="api-offline">⚠️ 後端未連線，顯示靜態資料</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section personal-intro">
      <h2>個人簡介</h2>
      {loading ? (
        <LoadingSpinner text="載入個人資料..." />
      ) : profile ? (
        <div className="content">
          <div className="profile">
            <div className="avatar">👤</div>
            <div className="info">
              <h3>姓名：{profile.name}</h3>
              <p>學號：{profile.student_id}</p>
              <p>學校：{profile.school}</p>
              {profile.bio && <p className="bio">{profile.bio}</p>}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PersonalIntro;
