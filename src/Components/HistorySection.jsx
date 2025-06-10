import './HistorySection.css';
import { FaHistory } from "react-icons/fa";

const HistorySection = () => (
  <section className="history">
    <h3><span className='hisicon'><FaHistory className='hissicon' /></span> HISTORY</h3>
    <table>
      <thead>
        <tr>
          <th>Car name</th>
          <th>Dispatch Status</th>
          <th>Dispatch Score</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4].map((_, i) => (
          <tr key={i}>
            <td>Car name</td>
            <td>Dispatch Status</td>
            <td>Dispatch Score</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="note">if you had more dispatches they’ll show up here lmao</p>
  </section>
);

export default HistorySection;
